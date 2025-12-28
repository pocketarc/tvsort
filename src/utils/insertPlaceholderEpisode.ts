import type { Knex } from "knex";
import type { EpisodeModel } from "@/utils/types";

export const PLACEHOLDER_PREFIX = "placeholder-";

/**
 * Generate a placeholder tmdb_id for episodes that don't exist in TMDB yet.
 */
export function generatePlaceholderTmdbId(showId: string, season: number, episodeNumber: number): string {
    return `${PLACEHOLDER_PREFIX}${showId}-s${season}e${episodeNumber}`;
}

/**
 * Check if an episode is a placeholder (not found in TMDB).
 */
export function isPlaceholderEpisode(tmdbId: string): boolean {
    return tmdbId.startsWith(PLACEHOLDER_PREFIX);
}

/**
 * Insert a placeholder episode when TMDB doesn't have the episode data.
 * This allows the episode to appear in the UI while waiting for TMDB to add it.
 */
export default async function insertPlaceholderEpisode(
    knex: Knex,
    showTmdbId: string,
    season: number,
    episodeNumber: number,
): Promise<EpisodeModel> {
    const placeholderTmdbId = generatePlaceholderTmdbId(showTmdbId, season, episodeNumber);

    console.log(
        `Inserting placeholder episode: show ${showTmdbId} S${season.toString().padStart(2, "0")}E${episodeNumber.toString().padStart(2, "0")}...`,
    );

    const episodeData: Partial<EpisodeModel> = {
        tmdb_id: placeholderTmdbId,
        show_id: showTmdbId,
        season: season,
        number: episodeNumber,
        title: "Unknown Episode",
        description: "Episode information not available on TMDB.",
        first_aired_at: null,
        images: JSON.stringify([]) as unknown as string[],
        imdb_id: null as unknown as string,
        imdb_summaries: JSON.stringify([]) as unknown as string[],
        imdb_synopsis: JSON.stringify([]) as unknown as string[],
        main_plot_points: JSON.stringify([]) as unknown as string[],
        all_plot_points: JSON.stringify([]) as unknown as string[],
    };

    await knex<EpisodeModel>("episodes").insert(episodeData).onConflict("tmdb_id").ignore();

    const inserted = await knex<EpisodeModel>("episodes").where({ tmdb_id: placeholderTmdbId }).first();

    if (!inserted) {
        throw new Error(`Failed to insert placeholder episode ${placeholderTmdbId}`);
    }

    return inserted;
}
