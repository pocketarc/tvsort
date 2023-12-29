"use client";

import { typeid } from "typeid-js";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
};

export default function StartRankingButton({ id }: Props) {
    const router = useRouter();

    const startRanking = useCallback(() => {
        const matrixId = typeid("matrix").toString();
        const url = `/show/${id}/${matrixId}`;

        router.push(url);
    }, [router, id]);

    return (
        <button
            onClick={startRanking}
            className="mt-8 truncate px-8 py-3 text-caribbean-900 font-title text-xl bg-caribbean-400 rounded-md border-t-2 border-caribbean-200 ring ring-caribbean-900"
        >
            Start ranking
        </button>
    );
}
