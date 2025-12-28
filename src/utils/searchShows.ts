import { parse as parseDate } from "date-fns/parse";
import { TMDB } from "tmdb-ts";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";
import type { ShowSummary } from "@/utils/types";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

export type SearchShowsResult = {
    query: string;
    shows: ShowSummary[];
};

export async function searchShows(query: string): Promise<SearchShowsResult> {
    if (!tmdbApiToken) {
        throw new Error("TMDB API token not configured");
    }

    const tmdb = new TMDB(tmdbApiToken);
    const results = await tmdb.search.tvShows({ query });
    const knex = getKnex();

    for (const show of results.results) {
        void getShowRecord(knex, show.id.toString());
    }

    const shows = results.results.map((show) => ({
        id: show.id.toString(),
        title: show.name,
        first_aired_at: show.first_air_date
            ? parseDate(show.first_air_date, "yyyy-MM-dd", new Date())
            : null,
        image: getShowImage(show.name, show.poster_path),
    }));

    return { query, shows };
}
