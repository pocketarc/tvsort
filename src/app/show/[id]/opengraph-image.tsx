import { ImageResponse } from "next/og";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";

// Image metadata
export const alt = "📺 TV Sort 📺";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
    params: { id: showId },
}: {
    params: { id: string };
}) {
    const knex = getKnex();

    const show = await getShowRecord(knex, showId);

    const bebasUrl =
        "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW0.woff";
    const interUrl =
        "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZs.woff";
    const bebas = fetch(new URL(bebasUrl)).then((res) => res.arrayBuffer());
    const inter = fetch(new URL(interUrl)).then((res) => res.arrayBuffer());

    let subtitle = `Which episode is -actually- your favourite? 🤔`;
    let showImage: string | undefined;

    if (show) {
        subtitle = `Which episode of ${show.title} is actually your favourite? 🤔`;
        showImage = getShowImage(show.title, show.image);
    }

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#d90429",
                color: "#ffffff",
                textShadow: "2px 2px 0px #8e0e24",
            }}
        >
            {showImage && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width: "35%",
                        height: "100%",
                    }}
                >
                    {/* biome-ignore lint/performance/noImgElement: OpenGraph images require img element */}
                    <img
                        src={showImage}
                        alt={show?.title}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    />
                </div>
            )}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: "1",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontFamily: "Bebas",
                        fontSize: "128px",
                        lineHeight: "1.375",
                        margin: "0px",
                    }}
                >
                    📺 TV Sort 📺
                </h1>
                <h2
                    style={{
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: "48px",
                        lineHeight: "1.375",
                        margin: "0px",
                    }}
                >
                    {subtitle}
                </h2>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Bebas",
                    data: await bebas,
                    style: "normal",
                    weight: 400,
                },
                {
                    name: "Inter",
                    data: await inter,
                    style: "normal",
                    weight: 400,
                },
            ],
        },
    );
}
