import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingMessage from "@/components/LoadingMessage";

type Props = {
    episodeCount: number | null | undefined;
    episodesSynced: number;
    title?: string | undefined;
    subtitle?: string | undefined;
};

export default function ShowLoader({ title, subtitle }: Props) {
    return (
        <main className="flex flex-col min-h-full">
            <div className="flex-grow flex flex-col">
                <Header title={title} subtitle={subtitle} />
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
