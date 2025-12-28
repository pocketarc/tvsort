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
    rewrites: async () => [
        {
            source: "/js/script.js",
            destination: "https://plausible.io/js/pa-DQzbOj4YxbGu6_20StSFT.js",
        },
        {
            source: "/api/event",
            destination: "https://plausible.io/api/event",
        },
    ],
    headers: async () => [
        {
            source: "/:path*",
            headers: [
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
                { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                { key: "Permissions-Policy", value: "autoplay=(self), cross-origin-isolated=(self)" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                    key: "Content-Security-Policy",
                    value: [
                        "default-src 'self'",
                        "script-src 'self' 'unsafe-inline' *.ingest.sentry.io static.cloudflareinsights.com",
                        "style-src 'self' 'unsafe-inline'",
                        "connect-src 'self' *.ingest.sentry.io cloudflareinsights.com",
                        "img-src 'self'",
                        "font-src 'self'",
                        "frame-src 'self'",
                        "object-src 'none'",
                        "base-uri 'self'",
                        "manifest-src 'self'",
                        "media-src 'self'",
                        "worker-src 'none'",
                        "report-uri https://o39003.ingest.sentry.io/api/4506473537142784/security/?sentry_key=edf14ed7586516238165feee59340cea",
                    ].join("; "),
                },
            ],
        },
    ],
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
          telemetry: false,
          tunnelRoute: "/monitoring",
          sourcemaps: {
              deleteSourcemapsAfterUpload: true,
          },
      })
    : nextConfig;
