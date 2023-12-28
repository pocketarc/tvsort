import type { Knex } from "knex";
import pg from "pg";
import { builtins } from "pg-types";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env["DB_USERNAME"] || !process.env["DB_PASSWORD"] || !process.env["DB_DATABASE"] || !process.env["DB_HOST"] || !process.env["DB_PORT"]) {
	throw new Error("DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, or DB_PORT is not defined.");
}

pg.types.setTypeParser(builtins.INT8, function (val) {
	return parseInt(val, 10);
});

const config: Knex.Config = {
	client: "postgresql",
	connection: {
		application_name: "api",
		user: process.env["DB_USERNAME"],
		password: process.env["DB_PASSWORD"],
		database: process.env["DB_DATABASE"],
		host: process.env["DB_HOST"],
		port: Number(process.env["DB_PORT"]),
	},
	pool: {
		min: 2,
		max: 2,
	},
	migrations: {
		directory: __dirname + "/migrations",
		tableName: "migrations",
		extension: "ts",
	},
};

export default config;
