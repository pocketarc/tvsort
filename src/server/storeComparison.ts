"use server";

import type { Comparison } from "@/utils/monkeySort";
import getKnex from "@/utils/getKnex";
import type { ComparisonModel } from "@/utils/types";

export const storeComparison = async (matrixId: string, episodeAId: string, episodeBId: string, comparison: Comparison): Promise<void> => {
    const knex = getKnex();

    await knex<ComparisonModel>("comparisons").insert({
        matrix_id: matrixId,
        episode_a_id: episodeAId,
        episode_b_id: episodeBId,
        comparison: comparison,
    });
};
