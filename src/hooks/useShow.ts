"use client";

import * as Sentry from "@sentry/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/utils/apiClient";
import type { GetShowStateResponse } from "@/utils/types";

export default function useShow(
    matrixId: string,
    initialState: GetShowStateResponse,
) {
    const [state, setState] = useState<GetShowStateResponse>(initialState);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showId = state.show.id;

    const fetchShowState = useCallback(async () => {
        try {
            const result = await api.getShowState(showId, matrixId);
            setState(result);
        } catch (error) {
            Sentry.captureException(error);
        }
    }, [showId, matrixId]);

    useEffect(() => {
        const scheduleRefresh = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (!state.synced) {
                timeoutRef.current = setTimeout(() => {
                    void fetchShowState().then(scheduleRefresh);
                }, 250);
            } else if (state.details) {
                const missingPlotPoints = state.details.show.seasons.flatMap(
                    (season) =>
                        season.episodes.filter(
                            (episode) => episode.plot_points.length === 0,
                        ),
                );

                if (missingPlotPoints.length > 0) {
                    timeoutRef.current = setTimeout(() => {
                        void fetchShowState().then(scheduleRefresh);
                    }, 2000);
                }
            }
        };

        scheduleRefresh();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [state, fetchShowState]);

    return {
        show: state.show,
        synced: state.synced,
        episodeCount: state.episodeCount,
        episodesSynced: state.episodesSynced,
        details: state.details,
    };
}
