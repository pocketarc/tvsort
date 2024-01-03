import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.dropColumn("episode_count");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.integer("episode_count").nullable().unsigned();
    });
}
