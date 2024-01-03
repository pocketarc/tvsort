"use client";

import type { Episode, Show } from "@/utils/types";
import { useCallback, useMemo, useState } from "react";
import CompareEpisodes from "@/components/CompareEpisodes";
import { type Comparison, ComparisonMatrix, monkeySort, NeedUserInput } from "@/utils/monkeySort";
import Results from "@/components/Results";
import { storeComparison } from "@/server/storeComparison";
import markAsCompleted from "@/server/markAsCompleted";

type Props = {
    show: Show;
    episodes: Episode[];
    explicitCount: number;
    isComplete: boolean;
    matrixId: string;
    matrix: Record<string, Record<string, Comparison>>;
};

export default function ShowSorter({ show, matrixId, isComplete, matrix, explicitCount, episodes }: Props) {
    const comparisonMatrix = useMemo(() => {
        const matrixFromStorage = typeof localStorage !== "undefined" ? localStorage.getItem(`matrix-${matrixId}`) : null;

        if (matrixFromStorage) {
            return new ComparisonMatrix(episodes, JSON.parse(matrixFromStorage), explicitCount);
        } else {
            return new ComparisonMatrix(episodes, matrix, explicitCount);
        }
    }, [matrixId, episodes, matrix, explicitCount]);
    const [results, setResults] = useState<Episode[]>();
    const [episodesToMatch, setEpisodesToMatch] = useState<[Episode, Episode] | undefined>();

    const tryQuickSort = useCallback(
        (matrix: ComparisonMatrix<Episode>) => {
            try {
                const result = monkeySort(matrix);

                // Mark the matrix as complete only if it's not already complete.
                if (!isComplete) {
                    void markAsCompleted(matrixId, matrix.matrix);
                }

                setResults(result);
            } catch (e) {
                if (e instanceof NeedUserInput) {
                    setEpisodesToMatch([e.a, e.b]);
                } else {
                    throw e;
                }
            }
        },
        [isComplete, matrixId],
    );

    // Run the quicksort algorithm on the matrix.
    // This is a memoized function, so it will only run when the matrix changes.
    // Instead of using a useEffect, we use a useMemo, because we want to run the function
    // on the server side as well, which enables us to pre-render the results.
    void useMemo(async () => {
        tryQuickSort(comparisonMatrix);
    }, [tryQuickSort, comparisonMatrix]);

    const onClick = (a: Episode, b: Episode, value: Comparison) => {
        comparisonMatrix.set(a, b, value);

        // Save the matrix to localStorage, so we can resume later.
        localStorage.setItem(`matrix-${matrixId}`, JSON.stringify(comparisonMatrix.matrix));

        // Save the comparison to the database, so we can use it for statistics.
        void storeComparison(matrixId, a.id, b.id, value);

        tryQuickSort(comparisonMatrix);
    };

    const estimatedComparisons = Math.ceil(episodes.length * Math.log2(episodes.length));
    const estimatedComparisonsLeft = estimatedComparisons - comparisonMatrix.explicitCount;

    return (
        <>
            {episodesToMatch && !results && (
                <div className="flex-grow flex pb-24">
                    <CompareEpisodes
                        show={show}
                        episode1={episodesToMatch[0]}
                        episode2={episodesToMatch[1]}
                        comparisonsLeft={estimatedComparisonsLeft}
                        onClick={onClick}
                    />
                </div>
            )}
            {results && (
                <div className="flex-grow">
                    <Results show={show} results={results} />
                </div>
            )}
        </>
    );
}
