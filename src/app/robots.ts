import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    if (!process.env["BASE_URL"]) {
        throw new Error("BASE_URL is not set.");
    }

    const baseUrl = process.env["BASE_URL"];

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
