import * as Sentry from "@sentry/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/utils/analytics";
import type { ApiErrorResponse } from "@/utils/apiTypes";
import getKnex from "@/utils/getKnex";
import { getShowStateInternal } from "@/utils/getShowStateInternal";
import type { GetShowStateResponse } from "@/utils/types";

const querySchema = z.object({
    matrixId: z.string().min(1, "Query parameter 'matrixId' is required"),
});

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    request: NextRequest,
    context: RouteContext,
): Promise<NextResponse<GetShowStateResponse | ApiErrorResponse>> {
    try {
        const { id: showId } = await context.params;
        const { searchParams } = new URL(request.url);

        const parseResult = querySchema.safeParse({
            matrixId: searchParams.get("matrixId"),
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

        const { matrixId } = parseResult.data;
        const knex = getKnex();
        const result = await getShowStateInternal(knex, showId, matrixId);

        return NextResponse.json(result);
    } catch (error) {
        Sentry.captureException(error);
        void trackServerEvent(
            "api-error",
            {
                endpoint: "/api/shows/[id]",
                statusCode: 500,
                errorType: error instanceof Error ? error.name : "Unknown",
            },
            request,
        );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
