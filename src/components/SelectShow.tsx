"use client";

import type { FindShowsResponse } from "@/server/findShows";
import ListShows from "@/components/ListShows";
import { ScaleIcon, SearchIcon, TrophyIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import LoadingMessage from "@/components/LoadingMessage";

type Props = {
    state: FindShowsResponse;
};

export default function SelectShow({ state }: Props) {
    const [query, setQuery] = useState<string>();
    const { pending: showLoading, data } = useFormStatus();
    const showResults = state.shows.length > 0 && !showLoading;
    const showIntro = (state.query === null || query !== state.query) && !showResults && !showLoading;
    const showNoResults = !showIntro && !showResults && !showLoading && query === state.query;

    return (
        <div className="w-full">
            {
                <div>
                    <label htmlFor="email" className="sr-only">
                        Select which TV show you want to watch {JSON.stringify(data)}
                    </label>
                    <div className="mt-2">
                        <input
                            type="search"
                            autoComplete={"off"}
                            name="query"
                            required={true}
                            id="show"
                            onInput={(e) => setQuery(e.currentTarget.value)}
                            className="block w-full rounded-sm border-0 p-4 text-persian-900 ring-1 ring-persian-800 placeholder:text-gray-400 focus:ring-2 focus:ring-persian-900 sm:text-sm sm:leading-6"
                            placeholder="Search for a TV show"
                        />
                    </div>
                </div>
            }
            {showIntro && (
                <div>
                    <h3 className="text-white text-2xl text-center py-8 text-shadow shadow-persian-900">How it works</h3>
                    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-8">
                        <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                            <SearchIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                            <div className="relative text-center z-10">Look up the TV show you want to rank</div>
                        </div>
                        <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                            <ScaleIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                            <div className="relative text-center z-10">Compare episodes in 1v1 battles</div>
                        </div>
                        <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                            <TrophyIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                            <div className="relative text-center z-10">Find out how you really feel about all those episodes</div>
                        </div>
                    </div>
                </div>
            )}
            {showNoResults && (
                <div className="mt-16 flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    <div className="text-white text-center text-2xl text-shadow shadow-persian-900">
                        No shows match <span className="font-bold">{query}</span>.
                    </div>
                </div>
            )}
            {showLoading && (
                <LoadingMessage className="mt-16 flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    Searching for shows matching <span className="font-bold">{query}</span>...
                </LoadingMessage>
            )}
            {showResults && <ListShows shows={state.shows} />}
        </div>
    );
}
