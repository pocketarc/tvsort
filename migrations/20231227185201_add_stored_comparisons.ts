import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("matrices", (table) => {
        table.string("id").primary();
        table.string("show_id").notNullable().references("tmdb_id").inTable("shows").onDelete("cascade");
        table.dateTime("created_at", { useTz: true, precision: 3 }).notNullable().defaultTo(knex.fn.now(3));
    });

    await knex.schema.createTable("comparisons", (table) => {
        table.string("matrix_id").notNullable().references("id").inTable("matrices").onDelete("cascade");
        table.string("episode_a_id").notNullable().references("tmdb_id").inTable("episodes").onDelete("cascade");
        table.string("episode_b_id").notNullable().references("tmdb_id").inTable("episodes").onDelete("cascade");
        table.string("comparison").notNullable();
        table.dateTime("created_at", { useTz: true, precision: 3 }).notNullable().defaultTo(knex.fn.now(3));
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("comparisons");
    await knex.schema.dropTable("matrices");
}
