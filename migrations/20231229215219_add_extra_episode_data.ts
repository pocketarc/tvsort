import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.jsonb("all_plot_points").notNullable().defaultTo("[]");
        table.renameColumn("plot_points", "main_plot_points");
        table.jsonb("imdb_synopsis").notNullable().defaultTo("[]");
        table.string("wikipedia_url");
        table.string("wikipedia_text");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("episodes", (table) => {
        table.dropColumn("all_plot_points");
        table.renameColumn("main_plot_points", "plot_points");
        table.dropColumn("imdb_synopsis");
        table.dropColumn("wikipedia_url");
        table.dropColumn("wikipedia_text");
    });
}
