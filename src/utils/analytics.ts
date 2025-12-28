import { usePlausible } from "next-plausible";

export type PlausibleEvents = {
    "show-search": { query: string; resultCount: number };
    "show-selected": { showId: string; showTitle: string };
    "ranking-started": { showId: string; episodeCount: number };
    "comparison-made": { showId: string; comparisonNumber: number };
    "ranking-completed": { showId: string; totalComparisons: number };
    "results-shared": { showId: string };
    "api-error": { endpoint: string; statusCode: number; errorType: string };
    "sync-completed": { showId: string; episodeCount: number };
};

export function useAnalytics() {
    return usePlausible<PlausibleEvents>();
}

export async function trackServerEvent<T extends keyof PlausibleEvents>(
    event: T,
    props: PlausibleEvents[T],
    request: Request,
): Promise<void> {
    const userAgent = request.headers.get("user-agent") || "TV Sort Server";
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const url = request.url;

    await fetch("https://plausible.io/api/event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
            "X-Forwarded-For": forwardedFor,
        },
        body: JSON.stringify({
            name: event,
            url: url,
            domain: "tvsort.com",
            props,
        }),
    });
}
