import type { Metadata, Viewport } from "next";
import { Bebas_Neue as BebasNeue, Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Script from "next/script";

const bebas = BebasNeue({ weight: "400", subsets: ["latin"], variable: "--font-title" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const viewport: Viewport = {
    themeColor: "#d90429",
    initialScale: 1,
    width: "device-width",
};

export async function generateMetadata(): Promise<Metadata> {
    const title = `TV Sort`;
    const description = `Which episode is -actually- your favourite? 🤔`;

    if (!process.env["BASE_URL"]) {
        throw new Error("BASE_URL is not set.");
    }

    const baseUrl = process.env["BASE_URL"];

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
    if (!process.env["BASE_URL"]) {
        throw new Error("BASE_URL is not set.");
    }

    const baseUrl = process.env["BASE_URL"];
    const domain = new URL(baseUrl).hostname;

    return (
        <html lang="en" className="h-full">
            <body className={`${inter.variable} ${bebas.variable} h-full`}>{children}</body>
            <Script src={`${baseUrl}/js/script.js`} strategy="afterInteractive" data-domain={domain} data-api="/api/event" />
        </html>
    );
}
