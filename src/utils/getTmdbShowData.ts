import type { ShowModel, TmdbExternalIds } from "@/utils/types";
import { TMDB } from "tmdb-ts";
import { parse as parseDate } from "date-fns/parse";

export default async function getTmdbShowData(tmdbId: string): Promise<Partial<ShowModel>> {
    if (!process.env["TMDB_API_ACCESS_TOKEN"]) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    const tmdb = new TMDB(process.env["TMDB_API_ACCESS_TOKEN"]);
    const show = await tmdb.tvShows.details(parseInt(tmdbId), ["external_ids"]);
    const showImage = show.poster_path ? `https://image.tmdb.org/t/p/w342/${show.poster_path}` : null;
    const externalIds = show.external_ids as TmdbExternalIds;

    return {
        tmdb_id: show.id.toString(),
        title: show.name,
        first_aired_at: show.first_air_date ? parseDate(show.first_air_date, "yyyy-MM-dd", new Date()) : null,
        image: showImage,
        wikidata_id: externalIds.wikidata_id,
    };
}
