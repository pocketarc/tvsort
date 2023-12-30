import type { Episode as EpisodeType, Show } from "@/utils/types";
import Episode from "@/components/Episode";
import type { Comparison } from "@/utils/monkeySort";
import Footer from "@/components/Footer";

type Props = {
    show: Show;
    episode1: EpisodeType;
    episode2: EpisodeType;
    comparisonsLeft: number;
    onClick: (a: EpisodeType, b: EpisodeType, value: Comparison) => unknown;
};

export default function CompareEpisodes({ episode1, episode2, comparisonsLeft, onClick }: Props) {
    return (
        <>
            <div className="flex flex-col md:flex-row md:space-x-12 h-full w-full">
                <div className="flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row flex-grow">
                        <div className="sm:w-1/2 flex-grow p-2 sm:p-12">
                            <Episode episode={episode1} />
                        </div>
                        <div className="sm:w-1/2 flex-grow p-2 sm:p-12">
                            <Episode episode={episode2} />
                        </div>
                    </div>
                    <div className="w-full bg-white fixed bottom-0">
                        <div className="p-2 sm:p-6 flex flex-row justify-around sm:justify-center space-x-2 sm:space-x-4">
                            <button
                                onClick={() => {
                                    onClick(episode1, episode2, ">");
                                }}
                                className="truncate px-4 py-2 text-white text-xs sm:text-base bg-persian-700 rounded-md border-t border-persian-100 ring ring-persian-900"
                            >
                                {episode1.title}
                            </button>
                            <button
                                onClick={() => {
                                    onClick(episode1, episode2, "=");
                                }}
                                className="px-4 py-2 text-white text-xs sm:text-base bg-persian-900 rounded-md border-t border-persian-100 ring ring-persian-900"
                            >
                                either
                            </button>
                            <button
                                onClick={() => {
                                    onClick(episode1, episode2, "<");
                                }}
                                className="truncate px-4 py-2 text-white text-xs sm:text-base bg-persian-700 rounded-md border-t border-persian-100 ring ring-persian-900"
                            >
                                {episode2.title}
                            </button>
                        </div>
                        <div className="w-full mx-auto mb-2 sm:mb-6 text-center text-stone-500 text-xs sm:text-sm">
                            <div>Your progress is saved. You can stop and come back any time.</div>
                        </div>
                        <Footer comparisonsLeft={comparisonsLeft} />
                    </div>
                </div>
                {/* <div className="p-12 bg-gray-50 h-full w-80 flex flex-col">
                    <div className="flex-grow space-y-4">
                        <h3 className="text-xl font-semibold">Your opinion so far:</h3>
                        {partialResults && (
                            <>
                                {partialResults.map((episode, index) => (
                                    <div key={index} className="flex">
                                        <div className="text-gray-400 mr-2">{index + 1}</div>
                                        <div>
                                            <div className="text-gray-900 font-semibold">{episode.title}</div>
                                            <div className="text-sm text-gray-500">
                                                Season {episode.season}, Episode {episode.number}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    {partialResults && <Progress actual={operations} expected={estimatedOperations} />}
                </div> */}
            </div>
        </>
    );
}
