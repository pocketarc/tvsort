"use server";

import type { GetShowStateResponse } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";
import { getShowStateInternal } from "@/utils/getShowStateInternal";

export const getShowState = async (_prevState: GetShowStateResponse, data: FormData): Promise<GetShowStateResponse> => {
    return withServerActionInstrumentation(
        "findShows",
        {
            formData: data,
            headers: headers(),
            recordResponse: true,
        },
        async (): Promise<GetShowStateResponse> => {
            const showId = data.get("showId");
            const matrixId = data.get("matrixId");

            if (typeof showId !== "string" || typeof matrixId !== "string") {
                throw new Error("Missing matrixId or showId.");
            }

            const knex = getKnex();
            return getShowStateInternal(knex, showId, matrixId);
        },
    );
};
