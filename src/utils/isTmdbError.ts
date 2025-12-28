/**
 * TMDB API error response structure.
 * The tmdb-ts library throws these objects directly (not wrapped in Error).
 */
export interface TmdbError {
    status_code: number;
    status_message: string;
    success: boolean;
}

/**
 * Type guard to check if an unknown error is a TMDB API error response.
 */
export function isTmdbError(e: unknown): e is TmdbError {
    return typeof e === "object" && e !== null && "status_code" in e && "status_message" in e && "success" in e;
}

/**
 * Check if the error is a TMDB "not found" error (status_code 34).
 * This typically means the episode/show doesn't exist in TMDB yet.
 */
export function isTmdbNotFound(e: unknown): boolean {
    return isTmdbError(e) && e.status_code === 34;
}
