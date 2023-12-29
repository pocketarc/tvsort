"use client";

import type { FindShowsResponse } from "@/server/findShows";
import ListShows from "@/components/ListShows";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import LoadingMessage from "@/components/LoadingMessage";
import Intro from "@/components/Intro";

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
                    <div>
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
            {showIntro && <Intro />}
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
