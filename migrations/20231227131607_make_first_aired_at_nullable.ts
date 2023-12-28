import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).nullable().alter();
    });

    await knex.schema.alterTable("episodes", (table) => {
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("shows", (table) => {
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).notNullable().alter();
    });

    await knex.schema.alterTable("episodes", (table) => {
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).notNullable().alter();
    });
}
