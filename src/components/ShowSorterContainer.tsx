"use client";

import Header from "@/components/Header";
import ShowLoader from "@/components/ShowLoader";
import ShowSorter from "@/components/ShowSorter";
import useShow from "@/hooks/useShow";
import type { GetShowStateResponse } from "@/utils/types";

type Props = {
    initialState: GetShowStateResponse;
    matrixId: string;
};

export default function ShowSorterContainer({ initialState, matrixId }: Props) {
    const { show, episodesSynced, episodeCount, synced, details } = useShow(
        matrixId,
        initialState,
    );
    const isLoading = !synced || !details || !show;

    return (
        <>
            {isLoading && (
                <ShowLoader
                    title={show?.title}
                    subtitle="Which of these episodes is better?"
                    episodeCount={episodeCount}
                    episodesSynced={episodesSynced}
                />
            )}
            {!isLoading && details && show && (
                <div className="h-full flex flex-col">
                    <Header
                        showTitleOnMobile={false}
                        title={show.title}
                        subtitle="Which of these episodes is better?"
                    />
                    <ShowSorter
                        show={details.show}
                        matrixId={matrixId}
                        isComplete={details.isComplete}
                        matrix={details.matrix}
                        explicitCount={details.explicitCount}
                        episodes={details.show.seasons.flatMap(
                            (season) => season.episodes,
                        )}
                    />
                </div>
            )}
        </>
    );
}
