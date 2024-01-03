import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    experimental: {
        serverComponentsExternalPackages: ["knex"],
    },
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
}

let exports = nextConfig;

if (process.env.SENTRY_DSN) {
    exports = withSentryConfig(
        exports,
        {
            dryRun: process.env.NODE_ENV !== "production",
            silent: true,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
        },
        {
            widenClientFileUpload: true,
            transpileClientSDK: false,
            tunnelRoute: "/monitoring",
            hideSourceMaps: true,
            disableLogger: true,
        },
    );
}

export default exports;