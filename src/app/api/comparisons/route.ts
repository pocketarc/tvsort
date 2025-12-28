import * as Sentry from "@sentry/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/utils/analytics";
import type { ApiErrorResponse, StoreComparisonResponse } from "@/utils/apiTypes";
import getKnex from "@/utils/getKnex";
import type { ComparisonModel } from "@/utils/types";

const bodySchema = z.object({
    matrixId: z.string().min(1),
    episodeAId: z.string().min(1),
    episodeBId: z.string().min(1),
    comparison: z.enum(["<", ">", "="]),
});

export async function POST(request: NextRequest): Promise<NextResponse<StoreComparisonResponse | ApiErrorResponse>> {
    try {
        const body: unknown = await request.json();
        const parseResult = bodySchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: parseResult.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { matrixId, episodeAId, episodeBId, comparison } = parseResult.data;
        const knex = getKnex();

        await knex<ComparisonModel>("comparisons")
            .insert({
                matrix_id: matrixId,
                episode_a_id: episodeAId,
                episode_b_id: episodeBId,
                comparison: comparison,
            })
            .onConflict(["matrix_id", "episode_a_id", "episode_b_id"] as const)
            .merge(["comparison"]);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        Sentry.captureException(error);
        void trackServerEvent(
            "api-error",
            {
                endpoint: "/api/comparisons",
                statusCode: 500,
                errorType: error instanceof Error ? error.name : "Unknown",
            },
            request,
        );
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
