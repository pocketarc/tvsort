import * as Sentry from "@sentry/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/utils/analytics";
import type { ApiErrorResponse, SearchShowsResponse } from "@/utils/apiTypes";
import { searchShows } from "@/utils/searchShows";

const querySchema = z.object({
    q: z.string().min(1, { error: "Query parameter 'q' is required" }),
});

export async function GET(request: NextRequest): Promise<NextResponse<SearchShowsResponse | ApiErrorResponse>> {
    try {
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
        const result = await searchShows(query);

        return NextResponse.json(result);
    } catch (error) {
        Sentry.captureException(error);
        void trackServerEvent(
            "api-error",
            {
                endpoint: "/api/shows",
                statusCode: 500,
                errorType: error instanceof Error ? error.name : "Unknown",
            },
            request,
        );
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
