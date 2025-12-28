import type { Comparison } from "@/utils/monkeySort";
import type { GetShowStateResponse, ShowSummary } from "@/utils/types";

export type SearchShowsResponse = {
    query: string;
    shows: ShowSummary[];
};

export type { GetShowStateResponse };

export type StoreComparisonRequest = {
    matrixId: string;
    episodeAId: string;
    episodeBId: string;
    comparison: Comparison;
};

export type StoreComparisonResponse = {
    success: boolean;
};

export type MarkAsCompletedRequest = {
    matrix: Record<string, Record<string, Comparison>>;
};

export type MarkAsCompletedResponse = {
    success: boolean;
    completedAt: string;
};

export type ApiErrorResponse = {
    error: string;
    details?: unknown;
};
