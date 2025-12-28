import * as Sentry from "@sentry/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/utils/analytics";
import type { ApiErrorResponse, MarkAsCompletedResponse } from "@/utils/apiTypes";
import getKnex from "@/utils/getKnex";
import type { ComparisonModel, MatrixModel } from "@/utils/types";

const comparisonSchema = z.enum(["<", ">", "="]);
const matrixSchema = z.record(z.string(), z.record(z.string(), comparisonSchema));

const bodySchema = z.object({
    matrix: matrixSchema,
});

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: NextRequest,
    context: RouteContext,
): Promise<NextResponse<MarkAsCompletedResponse | ApiErrorResponse>> {
    try {
        const { id: matrixId } = await context.params;
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

        const { matrix } = parseResult.data;
        const knex = getKnex();
        const completedAt = new Date();

        await knex.transaction(async (trx) => {
            await trx<ComparisonModel>("comparisons").delete().where("matrix_id", matrixId);

            for (const [episodeAId, episodeBComparisons] of Object.entries(matrix)) {
                for (const [episodeBId, comparison] of Object.entries(episodeBComparisons)) {
                    await trx<ComparisonModel>("comparisons").insert({
                        matrix_id: matrixId,
                        episode_a_id: episodeAId,
                        episode_b_id: episodeBId,
                        comparison: comparison,
                    });
                }
            }

            await trx<MatrixModel>("matrices").where("id", matrixId).update({ completed_at: completedAt });
        });

        return NextResponse.json({
            success: true,
            completedAt: completedAt.toISOString(),
        });
    } catch (error) {
        Sentry.captureException(error);
        void trackServerEvent(
            "api-error",
            {
                endpoint: "/api/matrices/[id]",
                statusCode: 500,
                errorType: error instanceof Error ? error.name : "Unknown",
            },
            request,
        );
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
