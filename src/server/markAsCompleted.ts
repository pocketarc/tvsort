"use server";

import type { Comparison } from "@/utils/monkeySort";
import getKnex from "@/utils/getKnex";
import type { ComparisonModel, MatrixModel } from "@/utils/types";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";

export default async function markAsCompleted<Key extends string>(matrixId: string, matrix: Record<Key, Record<Key, Comparison>>): Promise<void> {
    const data: FormData = new FormData();
    data.append("matrixId", matrixId);
    data.append("matrix", JSON.stringify(matrix));

    return withServerActionInstrumentation(
        "markAsCompleted",
        {
            formData: data,
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            const knex = getKnex();

            // There's a couple of "as" casts here to get around Object.entries() not returning the right type,
            // but the casts aren't the right thing to do, because this data is coming from the client.
            // We should actually be validating the data here with Zod, but that's a bigger refactor.
            // For now, I'm doing it this way and if there's ever a Sentry error caused by someone
            // trying to submit invalid data, I'll add validation then.

            await knex.transaction(async (trx) => {
                await trx<ComparisonModel>("comparisons").delete().where("matrix_id", matrixId);

                for (const [episodeAId, episodeBComparisons] of Object.entries(matrix)) {
                    for (const [episodeBId, comparison] of Object.entries(episodeBComparisons as Record<Key, Comparison>)) {
                        await trx<ComparisonModel>("comparisons").insert({
                            matrix_id: matrixId,
                            episode_a_id: episodeAId,
                            episode_b_id: episodeBId,
                            comparison: comparison as Comparison,
                        });
                    }
                }

                await trx<MatrixModel>("matrices").where("id", matrixId).update({
                    completed_at: new Date(),
                });
            });
        },
    );
}
