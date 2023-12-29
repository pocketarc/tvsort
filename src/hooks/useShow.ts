import { getShowState } from "@/server/getShowState";
import { useCallback, useEffect, useState } from "react";
import type { ShowSummary } from "@/utils/types";
import type { GetShowDetailsResponse } from "@/server/getShowDetails";
import * as Sentry from "@sentry/nextjs";

export default function useShow(matrixId: string, showId: string) {
    const [show, setShow] = useState<ShowSummary>();
    const [synced, setSynced] = useState<boolean>(false);
    const [episodesSynced, setEpisodesSynced] = useState<number>(0);
    const [episodeCount, setEpisodeCount] = useState<number>();
    const [details, setDetails] = useState<GetShowDetailsResponse>();

    const refreshShowState = useCallback(async () => {
        try {
            const { show, episodesSynced, episodeCount, synced, details } = await getShowState(matrixId, showId);
            setShow(show);
            setEpisodesSynced(episodesSynced);
            setSynced(synced);

            if (episodeCount) {
                setEpisodeCount(episodeCount);
            }

            if (details) {
                setDetails(details);
            }

            if (!synced) {
                setTimeout(refreshShowState, 250);
            } else if (details) {
                // Check if any episodes are still missing plot points:
                const missingPlotPoints = details.show.seasons.flatMap((season) => season.episodes.filter((episode) => episode.plot_points.length === 0));

                if (missingPlotPoints.length > 0) {
                    setTimeout(refreshShowState, 2000);
                }
            }
        } catch (error) {
            // We don't want to crash the app if we can't get the show state. Just try again in a bit.
            Sentry.captureException(error);
            setTimeout(refreshShowState, 2000);
        }
    }, [matrixId, showId]);

    useEffect(() => {
        void refreshShowState();
    }, [refreshShowState]);

    return {
        show,
        synced,
        episodeCount,
        episodesSynced,
        details,
    };
}
