import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("shows", (table) => {
        table.string("tmdb_id").notNullable().primary();
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).notNullable();
        table.dateTime("synced_at", { useTz: true, precision: 3 });
        table.string("title").notNullable();
        table.string("image").notNullable();
    });

    await knex.schema.createTable("episodes", (table) => {
        table.string("tmdb_id").notNullable().primary();
        table.string("imdb_id").notNullable();
        table.string("show_id").notNullable().references("tmdb_id").inTable("shows").onDelete("cascade");
        table.integer("season").notNullable();
        table.integer("number").notNullable();
        table.dateTime("first_aired_at", { useTz: true, precision: 3 }).notNullable();
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.jsonb("plot_points").notNullable();
        table.jsonb("images").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("episodes");
    await knex.schema.dropTable("shows");
}
