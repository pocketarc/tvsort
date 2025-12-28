import type { MetadataRoute } from "next";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const baseUrl = process.env["BASE_URL"];

export default function robots(): MetadataRoute.Robots {
    if (!baseUrl) {
        throw new Error("BASE_URL is not set.");
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
