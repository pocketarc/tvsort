"use client";

import type { Episode, Show } from "@/utils/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import CompareEpisodes from "@/components/CompareEpisodes";
import { type Comparison, ComparisonMatrix, monkeySort, NeedUserInput } from "@/utils/monkeySort";
import Results from "@/components/Results";
import { storeComparison } from "@/server/storeComparison";

type Props = {
    show: Show;
    episodes: Episode[];
    explicitCount: number;
    matrixId: string;
    matrix: Record<string, Record<string, Comparison>>;
};

export default function ShowSorter({ show, matrixId, matrix, explicitCount, episodes }: Props) {
    const comparisonMatrix = useMemo(() => {
        const matrixFromStorage = typeof window !== "undefined" ? localStorage.getItem(`matrix-${matrixId}`) : null;

        if (matrixFromStorage) {
            return new ComparisonMatrix(episodes, JSON.parse(matrixFromStorage), explicitCount);
        } else {
            return new ComparisonMatrix(episodes, matrix, explicitCount);
        }
    }, [matrixId, episodes, matrix, explicitCount]);
    const [results, setResults] = useState<Episode[]>();
    const [episodesToMatch, setEpisodesToMatch] = useState<[Episode, Episode] | undefined>();

    const tryQuickSort = useCallback((episodes: Episode[], matrix: ComparisonMatrix<Episode>) => {
        try {
            const result = monkeySort(episodes, matrix);
            setResults(result);
        } catch (e) {
            if (e instanceof NeedUserInput) {
                monkeySort(episodes, matrix, false);
                setEpisodesToMatch([e.a, e.b]);
            } else {
                throw e;
            }
        }
    }, []);

    useEffect(() => {
        tryQuickSort(episodes, comparisonMatrix);
    }, [tryQuickSort, episodes, comparisonMatrix]);

    const onClick = (a: Episode, b: Episode, value: Comparison) => {
        comparisonMatrix.set(a, b, value);

        // Save the matrix to localStorage, so we can resume later.
        localStorage.setItem(`matrix-${matrixId}`, JSON.stringify(comparisonMatrix.matrix));

        // Save the comparison to the database, so we can use it for statistics.
        void storeComparison(matrixId, a.id, b.id, value);

        tryQuickSort(episodes, comparisonMatrix);
    };

    return (
        <>
            {episodesToMatch && !results && (
                <div className="flex-grow flex pb-24">
                    <CompareEpisodes
                        show={show}
                        episode1={episodesToMatch[0]}
                        episode2={episodesToMatch[1]}
                        comparisonsLeft={comparisonMatrix.getComparisonsLeft()}
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
