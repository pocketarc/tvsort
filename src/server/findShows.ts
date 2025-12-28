"use server";

import { withServerActionInstrumentation } from "@sentry/nextjs";
import { parse as parseDate } from "date-fns/parse";
import { headers } from "next/headers";
import { TMDB } from "tmdb-ts";
import { z } from "zod";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";
import type { ShowSummary } from "@/utils/types";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

const schema = z.object({
    query: z.string(),
});

export type FindShowsResponse = {
    query: string | null;
    shows: ShowSummary[];
};

export const findShows = async (
    _prevState: FindShowsResponse,
    data: FormData,
): Promise<FindShowsResponse> => {
    return withServerActionInstrumentation(
        "findShows",
        {
            formData: data,
            headers: await headers(),
            recordResponse: true,
        },
        async () => {
            if (!tmdbApiToken) {
                throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
            }

            const tmdb = new TMDB(tmdbApiToken);
            const { query } = schema.parse({
                query: data.get("query"),
            });

            const results = await tmdb.search.tvShows({ query: query });
            const knex = getKnex();

            for (const show of results.results) {
                // Insert the show record if it doesn't exist.
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

            return {
                query,
                shows,
            };
        },
    );
};
