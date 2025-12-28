import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Knex } from "knex";
import pg from "pg";
import { builtins } from "pg-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbUsername = process.env["DB_USERNAME"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbPassword = process.env["DB_PASSWORD"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbDatabase = process.env["DB_DATABASE"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbHost = process.env["DB_HOST"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbPort = process.env["DB_PORT"];

if (!dbUsername || !dbPassword || !dbDatabase || !dbHost || !dbPort) {
    throw new Error("DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, or DB_PORT is not defined.");
}

pg.types.setTypeParser(builtins.INT8, (val) => parseInt(val, 10));

const config: Knex.Config = {
    client: "postgresql",
    connection: {
        application_name: "api",
        user: dbUsername,
        password: dbPassword,
        database: dbDatabase,
        host: dbHost,
        port: Number(dbPort),
    },
    pool: {
        min: 2,
        max: 2,
    },
    migrations: {
        directory: `${__dirname}/migrations`,
        tableName: "migrations",
        extension: "ts",
    },
};

export default config;
