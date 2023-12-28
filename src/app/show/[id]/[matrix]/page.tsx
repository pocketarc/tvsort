import { getShowDetails, getShowMetadata } from "@/server/getShowDetails";
import ShowSorter from "@/components/ShowSorter";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";

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
    const { show, matrix, explicitCount } = await getShowDetails(matrixId, id);
    const episodes = show.seasons.flatMap((season) => season.episodes);

    return (
        <div className="h-full flex flex-col">
            <Header title={show.title} subtitle="Which of these episodes is better?" />
            <ShowSorter show={show} matrixId={matrixId} matrix={matrix} explicitCount={explicitCount} episodes={episodes} />
        </div>
    );
}
