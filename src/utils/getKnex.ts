import type { Knex } from "knex";
import knex from "knex";
import knexConfig from "../../knexfile";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
    let knex: Knex | undefined;
}

export default function getKnex() {
    if (!globalThis.knex) {
        globalThis.knex = knex(knexConfig);
    }

    return globalThis.knex;
}
