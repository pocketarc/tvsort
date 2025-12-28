import type { Knex } from "knex";
import getPgBoss from "@/utils/getPgBoss";
import { getShowDetails } from "@/utils/getShowDetails";
import { getShowStateWithoutMatrix } from "@/utils/getShowStateWithoutMatrix";
import type { GetShowStateResponse, SyncShowJobData } from "@/utils/types";

export const getShowStateInternal = async (
    knex: Knex,
    showId: string,
    matrixId: string,
): Promise<GetShowStateResponse> => {
    const result = await getShowStateWithoutMatrix(knex, showId);

    if (result.synced) {
        const details = await getShowDetails(matrixId, showId);

        if (details) {
            console.log("Show is synced, sending back details.");
            return {
                ...result,
                details,
            };
        }
    }

    const boss = await getPgBoss();
    const jobData: SyncShowJobData = {
        jobName: "sync-show",
        tmdbId: showId,
    };

    const jobId = await boss.send("default", jobData, {
        // Make this job take precedence over generate-plot-points jobs.
        priority: 2,
        singletonKey: `${jobData.jobName}-${jobData.tmdbId}`,
    });

    console.log(`Sent sync-show job ${jobId}`);
    console.log("Show isn't synced yet, sending back summary.");
    return result;
};
