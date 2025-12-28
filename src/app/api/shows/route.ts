import * as Sentry from "@sentry/nextjs";
import { parse as parseDate } from "date-fns/parse";
import { type NextRequest, NextResponse } from "next/server";
import { TMDB } from "tmdb-ts";
import { z } from "zod";
import type { ApiErrorResponse, SearchShowsResponse } from "@/utils/apiTypes";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const tmdbApiToken = process.env["TMDB_API_ACCESS_TOKEN"];

const querySchema = z.object({
    q: z.string().min(1, "Query parameter 'q' is required"),
});

export async function GET(
    request: NextRequest,
): Promise<NextResponse<SearchShowsResponse | ApiErrorResponse>> {
    try {
        if (!tmdbApiToken) {
            return NextResponse.json(
                { error: "TMDB API token not configured" },
                { status: 500 },
            );
        }

        const { searchParams } = new URL(request.url);
        const parseResult = querySchema.safeParse({
            q: searchParams.get("q"),
        });

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: parseResult.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { q: query } = parseResult.data;
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

        return NextResponse.json({ query, shows });
    } catch (error) {
        Sentry.captureException(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
