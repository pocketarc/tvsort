import type { Metadata, Viewport } from "next";
import { Bebas_Neue as BebasNeue, Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import "./globals.css";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const baseUrl = process.env["BASE_URL"];

const bebas = BebasNeue({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-title",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const viewport: Viewport = {
    themeColor: "#d90429",
    initialScale: 1,
    width: "device-width",
};

export async function generateMetadata(): Promise<Metadata> {
    const title = `TV Sort`;
    const description = `Which episode is -actually- your favourite? 🤔`;

    if (!baseUrl) {
        throw new Error("BASE_URL is not set.");
    }

    return {
        metadataBase: new URL(baseUrl),
        title,
        description,
        alternates: {
            canonical: baseUrl,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    if (!baseUrl) {
        throw new Error("BASE_URL is not set.");
    }

    return (
        <html lang="en" className="h-full">
            <body className={`${inter.variable} ${bebas.variable} h-full`}>
                <Script id="plausible-init" strategy="beforeInteractive">
                    {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({endpoint:"/api/event"})`}
                </Script>
                <Script src="/js/script.js" strategy="afterInteractive" data-domain="tvsort.com" />
                {children}
            </body>
        </html>
    );
}
