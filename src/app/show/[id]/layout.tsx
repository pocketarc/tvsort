import React from "react";
import type { Metadata, Viewport } from "next";
import { getShowMetadata } from "@/utils/getShowMetadata";

export const viewport: Viewport = {
    themeColor: "#d90429",
    initialScale: 1,
    width: "device-width",
};

type Params = { id: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const show = await getShowMetadata(params.id);

    const title = `${show.title} - TV Sort`;
    const description = `Which episode of ${show.title} is your favourite?`;

    if (!process.env["BASE_URL"]) {
        throw new Error("BASE_URL is not set.");
    }

    return {
        metadataBase: new URL(process.env["BASE_URL"]),
        title,
        description,
        alternates: {
            canonical: `${process.env["BASE_URL"]}/show/${params.id}`,
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
