// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const sentryDsn = process.env["NEXT_PUBLIC_SENTRY_DSN"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const nodeEnv = process.env["NODE_ENV"];

if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        enabled: nodeEnv === "production",
        tracesSampleRate: 0.1,
        debug: false,
    });
}
