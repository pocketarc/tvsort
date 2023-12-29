import getImdbPlotSummary from "@/utils/getImdbPlotSummary";
import type { EpisodeModel, GeneratePlotPointsJobData, ShowModel } from "@/utils/types";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import type PgBoss from "pg-boss";
import type { Knex } from "knex";

export default async function handlerGeneratePlotPoints(_boss: PgBoss, knex: Knex, job: PgBoss.Job<GeneratePlotPointsJobData>) {
    const summaries = await getImdbPlotSummary(job.data.imdbId);

    await knex<EpisodeModel>("episodes")
        .update({
            imdb_summaries: JSON.stringify(summaries) as unknown as string[],
        })
        .where({
            tmdb_id: job.data.episodeId,
        });

    const show = await knex<ShowModel>("shows")
        .where({
            tmdb_id: job.data.showId,
        })
        .first();

    if (!show) {
        throw new Error(`Show with TMDB ID ${job.data.showId} not found`);
    }

    const episode = await knex<EpisodeModel>("episodes")
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
            plot_points: JSON.stringify(plotPoints) as unknown as string[],
            synced_at: new Date(),
        })
        .where({
            tmdb_id: job.data.episodeId,
        });

    // Update the show's synced_at timestamp to reflect the fact that we've synced an episode
    await knex<ShowModel>("shows")
        .update({
            synced_at: new Date(),
        })
        .where("tmdb_id", job.data.showId);
}
