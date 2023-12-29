import getImdbData from "@/utils/getImdbData";
import type { EpisodeModel, GeneratePlotPointsJobData, ShowModel } from "@/utils/types";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import type PgBoss from "pg-boss";
import type { Knex } from "knex";
import { getWikipediaData } from "@/utils/getWikipediaData";

export default async function handlerGeneratePlotPoints(_boss: PgBoss, knex: Knex, job: PgBoss.Job<GeneratePlotPointsJobData>) {
    const show = await knex<ShowModel>("shows")
        .where({
            tmdb_id: job.data.showId,
        })
        .first();

    if (!show) {
        throw new Error(`Show with TMDB ID ${job.data.showId} not found`);
    }

    let episode = await knex<EpisodeModel>("episodes")
        .where({
            tmdb_id: job.data.episodeId,
        })
        .first();

    if (!episode) {
        throw new Error(`Episode with TMDB ID ${job.data.episodeId} not found`);
    }

    if (episode.imdb_summaries.length === 0 && episode.imdb_synopsis.length === 0) {
        const imdbData = await getImdbData(job.data.imdbId);

        await knex<EpisodeModel>("episodes")
            .update({
                imdb_summaries: JSON.stringify(imdbData.summaries) as unknown as string[],
                imdb_synopsis: JSON.stringify(imdbData.synopsis) as unknown as string[],
            })
            .where({
                tmdb_id: job.data.episodeId,
            });
    }

    if (episode.wikipedia_url === null) {
        const wikipedia = await getWikipediaData(job.data.imdbId, show.title, episode.season, episode.number);

        await knex<EpisodeModel>("episodes")
            .update({
                wikipedia_url: wikipedia.url,
                wikipedia_text: wikipedia.text,
            })
            .where({
                tmdb_id: job.data.episodeId,
            });
    }

    if (episode.main_plot_points.length === 0 || episode.all_plot_points.length === 0) {
        // Get a fresh copy of the episode from the database, to account for the updates we may have just made.
        episode = await knex<EpisodeModel>("episodes")
            .where({
                tmdb_id: job.data.episodeId,
            })
            .first();

        if (!episode) {
            throw new Error(`Episode with TMDB ID ${job.data.episodeId} not found`);
        }

        const plotPoints = await generateEpisodePlotPoints(show, episode);

        await knex<EpisodeModel>("episodes")
            .update({
                all_plot_points: JSON.stringify(plotPoints.all_points) as unknown as string[],
                main_plot_points: JSON.stringify(plotPoints.main_points) as unknown as string[],
                synced_at: new Date(),
            })
            .where({
                tmdb_id: job.data.episodeId,
            });
    }

    // Update the show's synced_at timestamp to reflect the fact that we've synced an episode
    await knex<ShowModel>("shows")
        .update({
            synced_at: new Date(),
        })
        .where("tmdb_id", job.data.showId);
}
