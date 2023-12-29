"use server";

import type { Comparison } from "@/utils/monkeySort";
import getKnex from "@/utils/getKnex";
import type { ComparisonModel } from "@/utils/types";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";

export const storeComparison = async (matrixId: string, episodeAId: string, episodeBId: string, comparison: Comparison): Promise<void> => {
    const data: FormData = new FormData();
    data.append("matrixId", matrixId);
    data.append("episodeAId", episodeAId);
    data.append("episodeBId", episodeBId);
    data.append("comparison", comparison);

    return withServerActionInstrumentation(
        "findShows",
        {
            formData: data,
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            const knex = getKnex();

            await knex<ComparisonModel>("comparisons")
                .insert({
                    matrix_id: matrixId,
                    episode_a_id: episodeAId,
                    episode_b_id: episodeBId,
                    comparison: comparison,
                })
                .onConflict(["matrix_id", "episode_a_id", "episode_b_id"])
                .merge(["comparison"]);
        },
    );
};
