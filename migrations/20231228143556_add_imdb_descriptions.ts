import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.integer("episode_count").nullable().unsigned();
    });

    await knex.schema.alterTable("episodes", (table) => {
        table.jsonb("imdb_summaries").notNullable().defaultTo("[]");
        table.dateTime("synced_at", { useTz: true, precision: 3 });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.dropColumn("episode_count");
    });

    await knex.schema.alterTable("episodes", (table) => {
        table.dropColumn("imdb_summaries");
        table.dropColumn("synced_at");
    });
}
