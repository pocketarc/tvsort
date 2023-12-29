import type { MetadataRoute } from "next";
import getKnex from "@/utils/getKnex";
import type { ShowModel } from "@/utils/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://pocketarc.com";

    const sitemap: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const knex = getKnex();
    const shows = await knex<ShowModel>("shows").select();

    for (const show of shows) {
        sitemap.push({
            url: `${baseUrl}/shows/${show.tmdb_id}`,
            lastModified: show.synced_at ?? new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        });
    }

    return sitemap;
}
