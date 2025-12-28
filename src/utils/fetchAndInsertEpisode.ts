import type { Knex } from "knex";
import { TMDB } from "tmdb-ts";
import type { Image, Images } from "tmdb-ts/dist/types";
import getShowRecord from "@/utils/getShowRecord";
import type { EpisodeModel } from "@/utils/types";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

export default async function fetchAndInsertEpisode(
    knex: Knex,
    showTmdbId: string,
    season: number,
    episodeNumber: number,
): Promise<EpisodeModel> {
    if (!tmdbApiToken) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    // Ensure the show exists in the database
    await getShowRecord(knex, showTmdbId);

    const tmdb = new TMDB(tmdbApiToken);

    console.log(
        `Fetching episode from TMDB: show ${showTmdbId} S${season.toString().padStart(2, "0")}E${episodeNumber.toString().padStart(2, "0")}...`,
    );

    const episode = await tmdb.tvEpisode.details(
        {
            tvShowID: Number.parseInt(showTmdbId, 10),
            seasonNumber: season,
            episodeNumber: episodeNumber,
        },
        ["external_ids", "images"] as const,
    );

    const allEpisodeImages: Images & { stills?: Image[] } =
        episode.images as Images & { stills?: Image[] };
    const images =
        allEpisodeImages.stills?.map(
            (still) => `https://image.tmdb.org/t/p/w300/${still.file_path}`,
        ) ?? [];

    const episodeData: Partial<EpisodeModel> = {
        tmdb_id: episode.id.toString(),
        show_id: showTmdbId,
        season: season,
        number: episode.episode_number,
        title: episode.name,
        description: episode.overview,
        first_aired_at: episode.air_date ? new Date(episode.air_date) : null,
        images: JSON.stringify(images) as unknown as string[],
        imdb_id: episode.external_ids.imdb_id,
        imdb_summaries: JSON.stringify([]) as unknown as string[],
        imdb_synopsis: JSON.stringify([]) as unknown as string[],
        main_plot_points: JSON.stringify([]) as unknown as string[],
        all_plot_points: JSON.stringify([]) as unknown as string[],
    };

    console.log(`Inserting episode ${episode.id} into database...`);

    await knex<EpisodeModel>("episodes")
        .insert(episodeData)
        .onConflict("tmdb_id")
        .ignore();

    const inserted = await knex<EpisodeModel>("episodes")
        .where({ tmdb_id: episode.id.toString() })
        .first();

    if (!inserted) {
        throw new Error(`Failed to insert episode ${episode.id}`);
    }

    return inserted;
}
