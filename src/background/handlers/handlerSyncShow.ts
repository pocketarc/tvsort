import type { Knex } from "knex";
import type { Job, PgBoss } from "pg-boss";
import { TMDB } from "tmdb-ts";
import fetchAndInsertEpisode from "@/utils/fetchAndInsertEpisode";
import getShowRecord from "@/utils/getShowRecord";
import insertPlaceholderEpisode, { PLACEHOLDER_PREFIX } from "@/utils/insertPlaceholderEpisode";
import { isTmdbNotFound } from "@/utils/isTmdbError";
import type { EpisodeModel, GeneratePlotPointsJobData, ShowModel, SyncShowJobData } from "@/utils/types";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

export default async function handlerSyncShow(boss: PgBoss, knex: Knex, job: Job<SyncShowJobData>) {
    if (!tmdbApiToken) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    const showId = job.data.tmdbId;

    const result = await knex<ShowModel>("shows").select().where("tmdb_id", showId).whereNotNull("synced_at").first();

    if (result) {
        // If the show has already been synced, then we don't need to do anything.
        return;
    }

    const tmdb = new TMDB(tmdbApiToken);
    const show = await tmdb.tvShows.details(Number.parseInt(showId, 10));

    // Insert the show record if it doesn't exist.
    await getShowRecord(knex, show.id.toString());

    const placeholderEpisodes = await knex<EpisodeModel>("episodes")
        .select()
        .where("show_id", showId)
        .andWhere("tmdb_id", "like", `${PLACEHOLDER_PREFIX}%`);

    for (const placeholder of placeholderEpisodes) {
        try {
            const episode = await fetchAndInsertEpisode(knex, showId, placeholder.season, placeholder.number);
            await knex<EpisodeModel>("episodes").where("tmdb_id", placeholder.tmdb_id).delete();

            const jobData: GeneratePlotPointsJobData = {
                jobName: "generate-plot-points",
                showId: show.id.toString(),
                episodeId: episode.tmdb_id,
                imdbId: episode.imdb_id,
            };

            await boss.send("default", jobData, {
                retryLimit: 3,
                retryBackoff: true,
                expireInSeconds: 23 * 60 * 60,
                singletonKey: `${jobData.jobName}-${jobData.showId}-${jobData.episodeId}`,
            });

            console.log(`Replaced placeholder with real episode: ${episode.tmdb_id}`);
        } catch (e) {
            if (isTmdbNotFound(e)) {
                console.log(`Episode still not in TMDB: S${placeholder.season}E${placeholder.number}`);
            } else {
                throw e;
            }
        }
    }

    await Promise.all(
        show.seasons
            .filter((season) => {
                return season.season_number !== 0;
            })
            .map(async (season) => {
                for (let i = 1; i <= season.episode_count; i++) {
                    const episodeRecord = await knex<EpisodeModel>("episodes")
                        .select()
                        .where("show_id", showId)
                        .where("season", season.season_number)
                        .where("number", i)
                        .first();

                    if (!episodeRecord) {
                        try {
                            const episode = await fetchAndInsertEpisode(knex, showId, season.season_number, i);

                            const jobData: GeneratePlotPointsJobData = {
                                jobName: "generate-plot-points",
                                showId: show.id.toString(),
                                episodeId: episode.tmdb_id,
                                imdbId: episode.imdb_id,
                            };

                            await boss.send("default", jobData, {
                                retryLimit: 3,
                                retryBackoff: true,
                                expireInSeconds: 23 * 60 * 60,
                                singletonKey: `${jobData.jobName}-${jobData.showId}-${jobData.episodeId}`,
                            });
                        } catch (e) {
                            if (isTmdbNotFound(e)) {
                                await insertPlaceholderEpisode(knex, showId, season.season_number, i);
                            } else {
                                throw e;
                            }
                        }
                    }
                }
            }),
    );

    await knex<ShowModel>("shows")
        .update({
            synced_at: new Date(),
        })
        .where("tmdb_id", show.id.toString());
}
