import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Drop the old pg-boss v10 schema
    // pg-boss v12 will automatically recreate its schema on start()
    await knex.raw("DROP SCHEMA IF EXISTS pgboss CASCADE");
}

export async function down(_knex: Knex): Promise<void> {
    // Cannot restore v10 schema - pg-boss will recreate on start
    // This is a one-way migration
}
