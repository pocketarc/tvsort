import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.string("wikipedia_url", 8192).alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.string("wikipedia_url", 255).alter();
    });
}
