import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.string("image").nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.string("image").notNullable().alter();
    });
}
