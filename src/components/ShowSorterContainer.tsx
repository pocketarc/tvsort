"use client";

import useShow from "@/hooks/useShow";
import ShowLoader from "@/components/ShowLoader";
import Header from "@/components/Header";
import ShowSorter from "@/components/ShowSorter";

type Props = {
    id: string;
    matrixId: string;
};

export default function ShowSorterContainer({ id, matrixId }: Props) {
    const { show, episodesSynced, episodeCount, synced, details } = useShow(matrixId, id);
    const isLoading = !synced || !details || !show;

    return (
        <>
            {isLoading && <ShowLoader episodeCount={episodeCount} episodesSynced={episodesSynced} />}
            {!isLoading && details && show && (
                <div className="h-full flex flex-col">
                    <Header title={show.title} subtitle="Which of these episodes is better?" />
                    <ShowSorter
                        show={details.show}
                        matrixId={matrixId}
                        matrix={details.matrix}
                        explicitCount={details.explicitCount}
                        episodes={details.show.seasons.flatMap((season) => season.episodes)}
                    />
                </div>
            )}
        </>
    );
}
