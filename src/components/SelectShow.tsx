"use client";

import { useState } from "react";
import Intro from "@/components/Intro";
import ListShows from "@/components/ListShows";
import LoadingMessage from "@/components/LoadingMessage";
import type { ShowSummary } from "@/utils/types";

type Props = {
    state: {
        query: string | null;
        shows: ShowSummary[];
    };
    isPending: boolean;
    error: string | null;
    defaultQuery?: string | undefined;
};

export default function SelectShow({ state, isPending, error, defaultQuery }: Props) {
    const [query, setQuery] = useState<string | undefined>(defaultQuery);
    const showLoading = isPending;
    const showResults = state.shows.length > 0 && !showLoading;
    const showIntro = (state.query === null || query !== state.query) && !showResults && !showLoading;
    const showNoResults = !showIntro && !showResults && !showLoading && query === state.query;
    const showError = error && !showLoading;

    return (
        <div className="w-full">
            {
                <div>
                    <label htmlFor="show" className="sr-only">
                        Select which TV show you want to watch
                    </label>
                    <div>
                        <input
                            type="search"
                            autoComplete={"off"}
                            name="query"
                            required={true}
                            id="show"
                            defaultValue={defaultQuery}
                            onInput={(e) => setQuery(e.currentTarget.value)}
                            className="block w-full rounded-sm border-0 p-4 text-persian-900 ring-1 ring-persian-800 placeholder:text-gray-400 focus:ring-2 focus:ring-persian-900 sm:text-sm sm:leading-6"
                            placeholder="Search for a TV show"
                        />
                    </div>
                </div>
            }
            {showIntro && <Intro />}
            {showError && (
                <div className="mt-16 flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    <div className="text-red-300 text-center text-2xl text-shadow shadow-persian-900">{error}</div>
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
