import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SelectShowContainer from "@/components/SelectShowContainer";
import { searchShows } from "@/utils/searchShows";

type Props = {
    searchParams: Promise<{ query?: string }>;
};

export default async function Page({ searchParams }: Props) {
    const { query } = await searchParams;
    const trimmedQuery = query?.trim();
    const initialState = trimmedQuery
        ? await searchShows(trimmedQuery)
        : undefined;

    return (
        <main className="flex flex-col bg-persian-700 min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow flex justify-center">
                    <SelectShowContainer initialState={initialState} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
