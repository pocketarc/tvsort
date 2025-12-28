import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const sentryDsn = process.env["SENTRY_DSN"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const sentryOrg = process.env["SENTRY_ORG"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const sentryProject = process.env["SENTRY_PROJECT"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const ci = process.env["CI"];

const nextConfig: NextConfig = {
    reactStrictMode: false,
    serverExternalPackages: ["knex"],
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                hostname: "image.tmdb.org",
            },
            {
                hostname: "images.placeholders.dev",
            },
        ],
    },
    experimental: {
        serverActions: {
            // Disable server actions; they are a security risk that isn't worth it.
            allowedOrigins: [],
        },
    },
};

export default sentryDsn
    ? withSentryConfig(nextConfig, {
          org: sentryOrg as string,
          project: sentryProject as string,
          silent: !ci,
          widenClientFileUpload: true,
          tunnelRoute: "/monitoring",
          disableLogger: true,
          sourcemaps: {
              deleteSourcemapsAfterUpload: true,
          },
      })
    : nextConfig;
