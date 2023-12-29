import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("matrices", (table) => {
        table.dateTime("completed_at", { useTz: true, precision: 3 });
    });

    await knex.schema.alterTable("comparisons", (table) => {
        table.unique(["matrix_id", "episode_a_id", "episode_b_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("matrices", (table) => {
        table.dropColumn("completed_at");
    });

    await knex.schema.alterTable("comparisons", (table) => {
        table.dropUnique(["matrix_id", "episode_a_id", "episode_b_id"]);
    });
}
