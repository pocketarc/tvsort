// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const sentryDsn = process.env["SENTRY_DSN"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const nodeEnv = process.env["NODE_ENV"];

if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        enabled: nodeEnv === "production",
        tracesSampleRate: 0,
        debug: false,
    });
}
