import { ImageResponse } from "next/og";

// Image metadata
export const alt = "📺 TV Sort 📺";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
    const bebasUrl =
        "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW0.woff";
    const interUrl =
        "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZs.woff";
    const bebas = fetch(new URL(bebasUrl)).then((res) => res.arrayBuffer());
    const inter = fetch(new URL(interUrl)).then((res) => res.arrayBuffer());

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#d90429",
                color: "#ffffff",
                textShadow: "2px 2px 0px #8e0e24",
            }}
        >
            <h1
                style={{
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
                    fontFamily: "Inter",
                    fontSize: "48px",
                    lineHeight: "1.375",
                    margin: "0px",
                }}
            >
                Which episode is -actually- your favourite? 🤔
            </h2>
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
