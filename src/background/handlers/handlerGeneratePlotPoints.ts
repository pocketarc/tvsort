import type { Knex } from "knex";
import type PgBoss from "pg-boss";
import processEpisode from "@/utils/processEpisode";
import type { GeneratePlotPointsJobData } from "@/utils/types";

export default async function handlerGeneratePlotPoints(
    _boss: PgBoss,
    knex: Knex,
    job: PgBoss.Job<GeneratePlotPointsJobData>,
) {
    await processEpisode(knex, job.data.episodeId);
}
