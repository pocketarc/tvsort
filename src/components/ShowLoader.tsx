import React from "react";
import LoadingMessage from "@/components/LoadingMessage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
    episodeCount: number | null | undefined;
    episodesSynced: number;
};

export default function ShowLoader(_props: Props) {
    return (
        <main className="flex flex-col min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    <LoadingMessage bg="light" className="-mt-8">
                        Loading the show&apos;s details.
                    </LoadingMessage>
                </div>
            </div>
            <Footer />
        </main>
    );
}
