import type { Knex } from "knex";
import getTmdbShowData from "@/utils/getTmdbShowData";
import type { ShowModel } from "@/utils/types";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.string("wikidata_id").nullable();
    });

    const shows = await knex<ShowModel>("shows").select(["tmdb_id"]);

    // Update all shows with Wikidata IDs.
    for (const show of shows) {
        const data = await getTmdbShowData(show.tmdb_id);
        await knex<ShowModel>("shows").where("tmdb_id", show.tmdb_id).update(data);
    }

    await knex.schema.alterTable("episodes", (table) => {
        table.text("wikipedia_text").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.dropColumn("wikidata_id");
    });

    await knex.schema.alterTable("episodes", (table) => {
        table.string("wikipedia_text").alter();
    });
}
