import Header from "@/components/Header";
import LoadingMessage from "@/components/LoadingMessage";
import Footer from "@/components/Footer";

export default function Loading() {
    return (
        <main className="flex flex-col min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    <LoadingMessage bg="light" spin={false} className="-mt-8">
                        Loading the show&apos;s details.
                    </LoadingMessage>
                </div>
            </div>
            <Footer />
        </main>
    );
}
