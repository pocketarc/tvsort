"use client";

import * as Sentry from "@sentry/nextjs";
import { useCallback, useState, useTransition } from "react";
import { useAnalytics } from "@/utils/analytics";
import { ApiError, api } from "@/utils/apiClient";
import type { ShowSummary } from "@/utils/types";

type SearchShowsState = {
    query: string | null;
    shows: ShowSummary[];
    error: string | null;
};

type InitialState = {
    query: string;
    shows: ShowSummary[];
};

export function useSearchShows(initialState?: InitialState) {
    const [isPending, startTransition] = useTransition();
    const plausible = useAnalytics();
    const [state, setState] = useState<SearchShowsState>({
        query: initialState?.query ?? null,
        shows: initialState?.shows ?? [],
        error: null,
    });

    const searchShows = useCallback(
        (query: string) => {
            startTransition(async () => {
                try {
                    const result = await api.searchShows(query);
                    setState({
                        query: result.query,
                        shows: result.shows,
                        error: null,
                    });
                    plausible("show-search", {
                        props: {
                            query: result.query,
                            resultCount: result.shows.length,
                        },
                    });
                    const url = new URL(window.location.href);
                    url.searchParams.set("query", result.query);
                    window.history.replaceState({}, "", url.toString());
                } catch (error) {
                    Sentry.captureException(error);
                    setState((prev) => ({
                        ...prev,
                        error: error instanceof ApiError ? error.message : "Failed to search shows",
                    }));
                }
            });
        },
        [plausible],
    );

    return {
        ...state,
        isPending,
        searchShows,
    };
}
