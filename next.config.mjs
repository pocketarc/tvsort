
/** @type {import("next").NextConfig} */
const nextConfig = {
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

export default nextConfig;