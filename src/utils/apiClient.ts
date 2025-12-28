import type {
    ApiErrorResponse,
    MarkAsCompletedResponse,
    SearchShowsResponse,
    StoreComparisonResponse,
} from "@/utils/apiTypes";
import type { Comparison } from "@/utils/monkeySort";
import type { GetShowStateResponse } from "@/utils/types";

export class ApiError extends Error {
    public status: number;
    public response: ApiErrorResponse;

    constructor(status: number, response: ApiErrorResponse) {
        super(response.error);
        this.name = "ApiError";
        this.status = status;
        this.response = response;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data: unknown = await response.json();

    if (!response.ok) {
        throw new ApiError(response.status, data as ApiErrorResponse);
    }

    return data as T;
}

export const api = {
    /**
     * Search for TV shows by query
     */
    searchShows: async (query: string): Promise<SearchShowsResponse> => {
        const params = new URLSearchParams({ q: query });
        const response = await fetch(`/api/shows?${params.toString()}`);
        return handleResponse<SearchShowsResponse>(response);
    },

    /**
     * Get show state with matrix data
     */
    getShowState: async (
        showId: string,
        matrixId: string,
    ): Promise<GetShowStateResponse> => {
        const params = new URLSearchParams({ matrixId });
        const response = await fetch(
            `/api/shows/${showId}?${params.toString()}`,
        );
        return handleResponse<GetShowStateResponse>(response);
    },

    /**
     * Store a comparison between two episodes
     */
    storeComparison: async (
        matrixId: string,
        episodeAId: string,
        episodeBId: string,
        comparison: Comparison,
    ): Promise<StoreComparisonResponse> => {
        const response = await fetch("/api/comparisons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                matrixId,
                episodeAId,
                episodeBId,
                comparison,
            }),
        });
        return handleResponse<StoreComparisonResponse>(response);
    },

    /**
     * Mark a matrix as completed
     */
    markAsCompleted: async (
        matrixId: string,
        matrix: Record<string, Record<string, Comparison>>,
    ): Promise<MarkAsCompletedResponse> => {
        const response = await fetch(`/api/matrices/${matrixId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matrix }),
        });
        return handleResponse<MarkAsCompletedResponse>(response);
    },
};
