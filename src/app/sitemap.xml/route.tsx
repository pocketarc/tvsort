import type { MetadataRoute } from "next";
import getKnex from "@/utils/getKnex";
import type { ShowModel } from "@/utils/types";
import { formatRFC3339 } from "date-fns";
import { headers } from "next/headers";

export async function GET() {
    // This is here to force the route to be dynamic.
    headers();

    if (!process.env["BASE_URL"]) {
        throw new Error("BASE_URL is not set.");
    }

    const baseUrl = process.env["BASE_URL"];

    const sitemap: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const knex = getKnex();
    const shows = await knex<ShowModel>("shows").select();

    for (const show of shows) {
        sitemap.push({
            url: `${baseUrl}/show/${show.tmdb_id}`,
            lastModified: show.synced_at ?? new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        });
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     ${sitemap
         .map((item) => {
             return `
           <url>
               <loc>${item.url}</loc>
                ${item.lastModified ? `<lastmod>${formatRFC3339(item.lastModified)}</lastmod>` : ""}
                <changefreq>${item.changeFrequency}</changefreq>
                <priority>${item.priority}</priority>
           </url>
         `;
         })
         .join("")}
   </urlset>
 `;

    return new Response(xmlContent, { headers: { "Content-Type": "text/xml" } });
}
