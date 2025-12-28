import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

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
    allowedDevOrigins: ["tvsort.orb.local"],
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

const configWithPlausible = withPlausibleProxy({
    customDomain: 'https://tvsort.com',
})(nextConfig);

export default sentryDsn
    ? withSentryConfig(configWithPlausible, {
          org: sentryOrg as string,
          project: sentryProject as string,
          silent: !ci,
          widenClientFileUpload: true,
          tunnelRoute: "/monitoring",
          sourcemaps: {
              deleteSourcemapsAfterUpload: true,
          },
      })
    : configWithPlausible;
