import type PgBoss from "pg-boss";
import { isGeneratePlotPointsJob, isSyncShowJob, type JobData } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import getPgBoss from "@/utils/getPgBoss";
import handlerGeneratePlotPoints from "@/background/handlers/handlerGeneratePlotPoints";
import handlerSyncShow from "@/background/handlers/handlerSyncShow";

async function main() {
    const knex = getKnex();
    const boss = await getPgBoss();

    await boss.work(
        "default",
        {
            teamSize: 5,
            teamConcurrency: 5,
            teamRefill: true,
            newJobCheckInterval: 100,
            newJobCheckIntervalSeconds: 1,
        },
        handlerQueueJobs,
    );

    async function handlerQueueJobs(job: PgBoss.Job<JobData>) {
        if (isSyncShowJob(job)) {
            return handlerSyncShow(boss, knex, job);
        } else if (isGeneratePlotPointsJob(job)) {
            return handlerGeneratePlotPoints(boss, knex, job);
        } else {
            throw new Error(`Unknown job type: ${job.name}`);
        }
    }
}

// This is needed to avoid "Top-level await is currently not supported with the "cjs" output format".
// Switching this to a .mts opens up a whole new can of worms, so I'm just going to leave it like this for now.
void main();
