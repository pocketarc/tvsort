// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"] as string,
    enabled: process.env["NODE_ENV"] === "production",
    tracesSampleRate: 0.1,
    debug: false,
});
