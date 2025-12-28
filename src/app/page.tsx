import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SelectShowContainer from "@/components/SelectShowContainer";

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
