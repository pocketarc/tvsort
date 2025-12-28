import type { Knex } from "knex";
import type PgBoss from "pg-boss";
import { TMDB } from "tmdb-ts";
import type { Image, Images } from "tmdb-ts/dist/types";
import getShowRecord from "@/utils/getShowRecord";
import type {
    Episode,
    EpisodeModel,
    GeneratePlotPointsJobData,
    ShowModel,
    SyncShowJobData,
} from "@/utils/types";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

export default async function handlerSyncShow(
    boss: PgBoss,
    knex: Knex,
    job: PgBoss.Job<SyncShowJobData>,
) {
    if (!tmdbApiToken) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    const showId = job.data.tmdbId;

    const result = await knex<ShowModel>("shows")
        .select()
        .where("tmdb_id", showId)
        .whereNotNull("synced_at")
        .first();

    if (result) {
        // If the show has already been synced, then we don't need to do anything.
        return;
    }

    const tmdb = new TMDB(tmdbApiToken);
    const show = await tmdb.tvShows.details(Number.parseInt(showId, 10));

    // Insert the show record if it doesn't exist.
    await getShowRecord(knex, show.id.toString());

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
                        const episode = await tmdb.tvEpisode.details(
                            {
                                tvShowID: show.id,
                                seasonNumber: season.season_number,
                                episodeNumber: i,
                            },
                            ["external_ids", "images"],
                        );

                        const allEpisodeImages: Images & { stills?: Image[] } =
                            episode.images as Images & { stills?: Image[] };
                        const images =
                            allEpisodeImages.stills?.map(
                                (still) =>
                                    `https://image.tmdb.org/t/p/w300/${still.file_path}`,
                            ) ?? [];

                        const data: Episode = {
                            number: episode.episode_number,
                            title: episode.name,
                            description: episode.overview,
                            first_aired_at: episode.air_date
                                ? new Date(episode.air_date)
                                : null,
                            images,
                            season: season.season_number,
                            id: episode.id.toString(),
                            imdb_id: episode.external_ids.imdb_id,
                            imdb_summaries: [],
                            plot_points: [],
                        };

                        const result = await knex<EpisodeModel>("episodes")
                            .insert({
                                tmdb_id: data.id,
                                show_id: show.id.toString(),
                                season: data.season,
                                number: data.number,
                                title: data.title,
                                description: data.description,
                                first_aired_at: data.first_aired_at,
                                images: JSON.stringify(
                                    data.images,
                                ) as unknown as string[],
                                imdb_id: data.imdb_id,
                                imdb_summaries: JSON.stringify(
                                    data.imdb_summaries,
                                ) as unknown as string[],
                                main_plot_points: JSON.stringify(
                                    data.plot_points,
                                ) as unknown as string[],
                            })
                            .onConflict("tmdb_id")
                            .ignore()
                            .returning("tmdb_id");

                        // If the insert happened, then we need to generate the plot points.
                        if (result.length > 0) {
                            const jobData: GeneratePlotPointsJobData = {
                                jobName: "generate-plot-points",
                                showId: show.id.toString(),
                                episodeId: data.id,
                                imdbId: data.imdb_id,
                            };

                            await boss.send("default", jobData, {
                                retryLimit: 3,
                                retryBackoff: true,
                                expireInHours: 24,
                                singletonKey: `${jobData.jobName}-${jobData.showId}-${jobData.episodeId}`,
                            });
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
