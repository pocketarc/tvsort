import { PgBoss } from "pg-boss";

declare namespace globalThis {
    let pgBoss: PgBoss | undefined;
}

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbUsername = process.env["DB_USERNAME"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbPassword = process.env["DB_PASSWORD"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbHost = process.env["DB_HOST"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const dbDatabase = process.env["DB_DATABASE"];

export default async function getPgBoss() {
    if (!globalThis.pgBoss) {
        globalThis.pgBoss = new PgBoss(`postgres://${dbUsername}:${dbPassword}@${dbHost}/${dbDatabase}`);
        globalThis.pgBoss = await globalThis.pgBoss.start();
        await globalThis.pgBoss.createQueue("default");
    }

    return globalThis.pgBoss;
}
