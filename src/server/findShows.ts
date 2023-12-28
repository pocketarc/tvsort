"use server";

import type { ShowModel, ShowSummary } from "@/utils/types";
import { TMDB } from "tmdb-ts";
import { z } from "zod";
import { parse as parseDate } from "date-fns/parse";
import getShowImage from "@/utils/getShowImage";
import getKnex from "@/utils/getKnex";

const schema = z.object({
    query: z.string(),
});

export type FindShowsResponse = {
    query: string | null;
    shows: ShowSummary[];
};

export const findShows = async (_prevState: FindShowsResponse, data: FormData): Promise<FindShowsResponse> => {
    if (!process.env["TMDB_API_ACCESS_TOKEN"]) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    const tmdb = new TMDB(process.env["TMDB_API_ACCESS_TOKEN"]);
    const { query } = schema.parse({
        query: data.get("query"),
    });

    const results = await tmdb.search.tvShows({ query: query });
    const knex = getKnex();

    for (const show of results.results) {
        const showImage = show.poster_path ? `https://image.tmdb.org/t/p/w342/${show.poster_path}` : null;

        await knex<ShowModel>("shows")
            .insert({
                tmdb_id: show.id.toString(),
                title: show.name,
                first_aired_at: show.first_air_date ? parseDate(show.first_air_date, "yyyy-MM-dd", new Date()) : null,
                image: showImage,
            })
            .onConflict("tmdb_id")
            .ignore();
    }

    const shows = results.results.map((show) => ({
        id: show.id.toString(),
        title: show.name,
        first_aired_at: show.first_air_date ? parseDate(show.first_air_date, "yyyy-MM-dd", new Date()) : null,
        image: getShowImage(show.name, show.poster_path),
    }));

    return {
        query,
        shows,
    };
};
