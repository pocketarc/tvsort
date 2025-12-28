import type { Knex } from "knex";
import getTmdbShowData from "@/utils/getTmdbShowData";
import type { ShowModel } from "@/utils/types";

export default async function getShowRecord(
    knex: Knex,
    tmdbId: string,
): Promise<ShowModel> {
    let records: ShowModel[];
    let record = await knex<ShowModel>("shows")
        .where("tmdb_id", tmdbId)
        .first();

    if (!record) {
        const data = await getTmdbShowData(tmdbId);
        records = await knex<ShowModel>("shows")
            .insert(data)
            .onConflict("tmdb_id")
            .ignore()
            .returning("*");

        if (records[0]) {
            record = records[0];
        } else {
            throw new Error("Failed to insert show record.");
        }
    }

    return record;
}
