import type { Knex } from "knex";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import getImdbData from "@/utils/getImdbData";
import { getWikipediaData } from "@/utils/getWikipediaData";
import type { EpisodeModel, ShowModel } from "@/utils/types";

export default async function processEpisode(
    knex: Knex,
    episodeTmdbId: string,
): Promise<void> {
    let episode = await knex<EpisodeModel>("episodes")
        .where({ tmdb_id: episodeTmdbId })
        .first();

    if (!episode) {
        throw new Error(`Episode with TMDB ID ${episodeTmdbId} not found`);
    }

    const show = await knex<ShowModel>("shows")
        .where({ tmdb_id: episode.show_id })
        .first();

    if (!show) {
        throw new Error(`Show with TMDB ID ${episode.show_id} not found`);
    }

    if (
        episode.imdb_id &&
        episode.imdb_summaries.length === 0 &&
        episode.imdb_synopsis.length === 0
    ) {
        console.log(`Fetching IMDb data for episode ${episodeTmdbId}...`);
        const imdbData = await getImdbData(episode.imdb_id);

        await knex<EpisodeModel>("episodes")
            .update({
                imdb_summaries: JSON.stringify(
                    imdbData.summaries,
                ) as unknown as string[],
                imdb_synopsis: JSON.stringify(
                    imdbData.synopsis,
                ) as unknown as string[],
            })
            .where({ tmdb_id: episodeTmdbId });
    }

    if (episode.imdb_id && episode.wikipedia_url === null) {
        console.log(`Fetching Wikipedia data for episode ${episodeTmdbId}...`);
        const wikipedia = await getWikipediaData(
            episode.imdb_id,
            show.wikidata_id,
            episode.season,
            episode.number,
        );

        await knex<EpisodeModel>("episodes")
            .update({
                wikipedia_url: wikipedia.url,
                wikipedia_text: wikipedia.text,
            })
            .where({ tmdb_id: episodeTmdbId });
    }

    if (
        episode.main_plot_points.length === 0 ||
        episode.all_plot_points.length === 0
    ) {
        // Get a fresh copy of the episode from the database, to account for the updates we may have just made.
        episode = await knex<EpisodeModel>("episodes")
            .where({ tmdb_id: episodeTmdbId })
            .first();

        if (!episode) {
            throw new Error(`Episode with TMDB ID ${episodeTmdbId} not found`);
        }

        console.log(`Generating plot points for episode ${episodeTmdbId}...`);
        const plotPoints = await generateEpisodePlotPoints(show, episode);

        await knex<EpisodeModel>("episodes")
            .update({
                all_plot_points: JSON.stringify(
                    plotPoints.all_points,
                ) as unknown as string[],
                main_plot_points: JSON.stringify(
                    plotPoints.main_points,
                ) as unknown as string[],
                synced_at: new Date(),
            })
            .where({ tmdb_id: episodeTmdbId });
    }

    // Update the show's synced_at timestamp to reflect the fact that we've synced an episode
    await knex<ShowModel>("shows")
        .update({ synced_at: new Date() })
        .where("tmdb_id", episode.show_id);

    console.log(`Episode ${episodeTmdbId} processed successfully.`);
}
