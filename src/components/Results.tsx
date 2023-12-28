import type { Episode as EpisodeType, Show } from "@/utils/types";
import Episode from "@/components/Episode";
import Footer from "@/components/Footer";

type Props = {
    show: Show;
    results: EpisodeType[];
};

export default function Results({ show, results }: Props) {
    const firstPlace = results[0];
    const secondPlace = results[1];
    const lastPlace = results[results.length - 1];
    const secondToLastPlace = results[results.length - 2];

    if (!firstPlace || !secondPlace || !lastPlace || !secondToLastPlace) {
        return (
            <p>
                Results are missing. This is a bug. Please report it to <a href="https://twitter.com/pocketarc">PocketArC on Twitter</a>.
            </p>
        );
    }

    const shareResults = async () => {
        const shareData: ShareData = {
            title: `My favourite episodes of ${show.title} are ${firstPlace.title} and ${secondPlace.title}!`,
            text: `My favourite episodes of ${show.title} are ${firstPlace.title} and ${secondPlace.title}!`,
            url: window.location.href,
        };

        const twitterSearchParams = new URLSearchParams();
        twitterSearchParams.set(
            "text",
            `My favourite episodes of ${show.title} are ${firstPlace.title} and ${secondPlace.title}. I also really hated ${lastPlace.title}.`,
        );
        twitterSearchParams.set("url", window.location.href);
        const twitterUrl = `https://twitter.com/intent/tweet?${twitterSearchParams.toString()}`;

        if ("share" in navigator) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                // Do nothing; the user probably cancelled the share.
            }
        } else {
            window.open(twitterUrl, "_blank");
        }
    };

    return (
        <>
            <main className="max-w-4xl mx-auto py-12">
                <div className="flex flex-col h-full">
                    <h2 className="text-7xl py-60 flex flex-col justify-center font-title font-bold text-center text-stone-800">
                        Your favourite episodes are...
                        <br />
                        <span>🥁🥁🥁</span>
                    </h2>
                    <div className="px-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-1/2 bg-stone-100 rounded-md p-8">
                                <Episode standing={1} episode={firstPlace} />
                            </div>
                            <div className="sm:w-1/2 bg-stone-100 rounded-md p-8">
                                <Episode standing={2} episode={secondPlace} />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-7xl py-48 flex flex-col justify-center font-title font-bold text-center text-stone-800">
                        And you really hated...
                        <br />
                        <span>🤬🤬🤬</span>
                    </h2>
                    <div className="px-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-1/2 bg-stone-100 rounded-md p-8">
                                <Episode episode={lastPlace} />
                            </div>
                            <div className="sm:w-1/2 bg-stone-100 rounded-md p-8">
                                <Episode episode={secondToLastPlace} />
                            </div>
                        </div>
                    </div>

                    <div className="px-4">
                        <button onClick={shareResults} className="w-full my-32 bg-persian-700 rounded-md p-8 text-white">
                            <span className="block text-3xl sm:text-7xl font-title text-shadow shadow-persian-950">Share your results</span>
                            <span>
                                Tell everyone how much you love <span className="font-bold">{firstPlace.title}</span>. <br className="hidden sm:block" />
                                Or how much you hate <span className="font-bold">{lastPlace.title}</span>.
                            </span>
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-2 text-sm text-gray-500">The full list, for the data nerds</span>
                            </div>
                        </div>
                        <div className="space-y-4 px-4 py-12 sm:p-12 rounded-md h-full">
                            {results.map((episode, index) => (
                                <div key={index} className="flex">
                                    <div className="text-stone-400 mr-2">{index + 1}</div>
                                    <div>
                                        <div className="text-stone-900 font-semibold">{episode.title}</div>
                                        <div className="text-sm text-stone-500">
                                            Season {episode.season}, Episode {episode.number}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
