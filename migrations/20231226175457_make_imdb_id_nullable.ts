import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.string("imdb_id").nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.string("imdb_id").notNullable().alter();
    });
}
