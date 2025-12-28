import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import StartRankingButton from "@/components/StartRankingButton";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    const knex = getKnex();
    const show = await getShowRecord(knex, id);
    const showImage = getShowImage(show.title, show.image);

    return (
        <main className="flex flex-col bg-persian-700 min-h-full">
            <div className="flex-grow flex flex-col">
                <Header showSubtitle={false} />
                <div className="sm:mt-10 flex-grow flex flex-col p-4 max-w-3xl mx-auto">
                    <div
                        className={
                            "flex flex-col sm:flex-row gap-8 justify-center items-center text-shadow shadow-persian-900 text-white text-center bg-persian-700"
                        }
                    >
                        <div className="flex items-center w-2/3 sm:w-1/3 flex-shrink-0 h-full">
                            <Image
                                width={342}
                                height={513}
                                src={showImage}
                                alt={show.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-2xl sm:text-4xl">
                                Which episode of {show.title} is <span className="text-nowrap">-actually-</span> your
                                favourite? 🤔
                            </h2>
                            <StartRankingButton id={id} />
                        </div>
                    </div>

                    <Intro />
                </div>
            </div>
            <Footer />
        </main>
    );
}
