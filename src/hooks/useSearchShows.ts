"use client";

import * as Sentry from "@sentry/nextjs";
import { useCallback, useState, useTransition } from "react";
import { ApiError, api } from "@/utils/apiClient";
import type { ShowSummary } from "@/utils/types";

type SearchShowsState = {
    query: string | null;
    shows: ShowSummary[];
    error: string | null;
};

export function useSearchShows() {
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<SearchShowsState>({
        query: null,
        shows: [],
        error: null,
    });

    const searchShows = useCallback((query: string) => {
        startTransition(async () => {
            try {
                const result = await api.searchShows(query);
                setState({
                    query: result.query,
                    shows: result.shows,
                    error: null,
                });
            } catch (error) {
                Sentry.captureException(error);
                setState((prev) => ({
                    ...prev,
                    error:
                        error instanceof ApiError
                            ? error.message
                            : "Failed to search shows",
                }));
            }
        });
    }, []);

    return {
        ...state,
        isPending,
        searchShows,
    };
}
