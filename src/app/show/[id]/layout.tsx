import type { Metadata, Viewport } from "next";
import type React from "react";
import getKnex from "@/utils/getKnex";
import { getShowStateWithoutMatrix } from "@/utils/getShowStateWithoutMatrix";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const baseUrl = process.env["BASE_URL"];

export const viewport: Viewport = {
    themeColor: "#d90429",
    initialScale: 1,
    width: "device-width",
};

type Params = { id: string };

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { id } = await params;
    const knex = getKnex();
    const { show } = await getShowStateWithoutMatrix(knex, id);

    const title = `${show.title} - TV Sort`;
    const description = `Which episode of ${show.title} is your favourite?`;

    if (!baseUrl) {
        throw new Error("BASE_URL is not set.");
    }

    return {
        metadataBase: new URL(baseUrl),
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/show/${id}`,
        },
        openGraph: {
            type: "website",
        },
        twitter: {
            card: "summary",
            title: title,
            description: description,
            creator: "@pocketarc",
            site: "@pocketarc",
        },
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
