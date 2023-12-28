import PgBoss from "pg-boss";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
    let pgBoss: PgBoss | undefined;
}

export default async function getPgBoss() {
    if (!globalThis.pgBoss) {
        globalThis.pgBoss = new PgBoss(
            `postgres://${process.env["DB_USERNAME"]}:${process.env["DB_PASSWORD"]}@${process.env["DB_HOST"]}/${process.env["DB_DATABASE"]}`,
        );
        globalThis.pgBoss = await globalThis.pgBoss.start();
    }

    return globalThis.pgBoss;
}
