import knex from "knex";
import type { Knex } from "knex";
import knexConfig from "../../knexfile";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
    let knex: Knex | undefined;
}

export default function getKnex() {
    if (!globalThis.knex) {
        globalThis.knex = knex(knexConfig);
    }

    return globalThis.knex;
}
