import Footer from "@/components/Footer";
import SelectShowContainer from "@/components/SelectShowContainer";
import Header from "@/components/Header";

export default function Page() {
    return (
        <main className="flex flex-col bg-persian-700 min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow flex justify-center">
                    <SelectShowContainer />
                </div>
            </div>
            <Footer />
        </main>
    );
}
