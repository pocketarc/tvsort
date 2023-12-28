import type { Metadata, Viewport } from "next";
import { getShowMetadata } from "@/utils/getShowMetadata";
import ShowSorterContainer from "@/components/ShowSorterContainer";

type Params = { id: string; matrix: string };

export const viewport: Viewport = {
    themeColor: "#d90429",
    initialScale: 1,
    width: "device-width",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const show = await getShowMetadata(params.id);

    const title = `${show.title} - TV Sort`;
    const description = `Which episode of ${show.title} is your favourite?`;

    return {
        metadataBase: new URL("https://tvsort.com"),
        title,
        description,
        icons: "/icon.svg",
        alternates: {
            canonical: `https://tvsort.com/show/${params.id}`,
        },
        openGraph: {
            type: "website",
            images: [
                {
                    url: show.image,
                    width: 342,
                    height: 513,
                    alt: `Poster for ${show.title}`,
                },
            ],
        },
        twitter: {
            card: "summary",
            title: title,
            description: description,
            creator: "@pocketarc",
            site: "@pocketarc",
            images: {
                url: show.image,
                width: 342,
                height: 513,
            },
        },
    };
}

export default async function Page({ params: { id, matrix: matrixId } }: { params: Params }) {
    return <ShowSorterContainer id={id} matrixId={matrixId} />;
}
