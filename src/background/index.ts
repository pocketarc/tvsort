import type PgBoss from "pg-boss";
import { isGeneratePlotPointsJob, isSyncShowJob, type JobData } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import getPgBoss from "@/utils/getPgBoss";
import handlerGeneratePlotPoints from "@/background/handlers/handlerGeneratePlotPoints";
import handlerSyncShow from "@/background/handlers/handlerSyncShow";
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env["SENTRY_DSN"] as string,
    enabled: process.env["NODE_ENV"] === "production",
    tracesSampleRate: 0,
    debug: false,
});

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
        try {
            if (isSyncShowJob(job)) {
                await handlerSyncShow(boss, knex, job);
            } else if (isGeneratePlotPointsJob(job)) {
                await handlerGeneratePlotPoints(boss, knex, job);
            } else {
                throw new Error(`Unknown job type: ${job.name}`);
            }
        } catch (e) {
            // Log the error to Sentry, so we have some visibility into what's going on.
            Sentry.captureException(e);

            // Re-throw the error, so that PgBoss knows to retry the job.
            throw e;
        }
    }
}

// This is needed to avoid "Top-level await is currently not supported with the "cjs" output format".
// Switching this to a .mts opens up a whole new can of worms, so I'm just going to leave it like this for now.
void main();
