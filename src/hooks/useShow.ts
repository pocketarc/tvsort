import * as Sentry from "@sentry/nextjs";
import { useCallback } from "react";
import { useFormState } from "react-dom";
import { getShowState } from "@/server/getShowState";
import type { GetShowStateResponse } from "@/utils/types";

export default function useShow(
    matrixId: string,
    initialState: GetShowStateResponse,
) {
    const [state, formAction] = useFormState(getShowState, initialState);
    const showId = state.show.id;

    const refreshShowState = useCallback(async () => {
        const fetchShowState = async () => {
            const data: FormData = new FormData();
            data.append("matrixId", matrixId);
            data.append("showId", showId);
            formAction(data);
        };

        try {
            if (!state.synced) {
                setTimeout(fetchShowState, 250);
            } else if (state.details) {
                // Check if any episodes are still missing plot points:
                const missingPlotPoints = state.details.show.seasons.flatMap(
                    (season) =>
                        season.episodes.filter(
                            (episode) => episode.plot_points.length === 0,
                        ),
                );

                if (missingPlotPoints.length > 0) {
                    setTimeout(fetchShowState, 2000);
                }
            }
        } catch (error) {
            // We don't want to crash the app if we can't get the show state. Just try again in a bit.
            Sentry.captureException(error);
            setTimeout(fetchShowState, 2000);
        }
    }, [formAction, state, matrixId, showId]);

    void refreshShowState();

    return {
        show: state.show,
        synced: state.synced,
        episodeCount: state.episodeCount,
        episodesSynced: state.episodesSynced,
        details: state.details,
    };
}
