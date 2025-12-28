import type { Job } from "pg-boss";
import type { GetShowDetailsResponse } from "@/utils/getShowDetails";
import type { Comparison } from "@/utils/monkeySort";

export type ShowSummary = {
    id: string;
    title: string;
    first_aired_at: Date | null;
    image: string;
};

export type Show = {
    id: string;
    title: string;
    first_aired_at: Date | null;
    image: string;
    seasons: Season[];
};

export type Season = {
    number: number;
    episodes: Episode[];
};

export type Episode = {
    id: string;
    imdb_id: string;
    season: number;
    number: number;
    first_aired_at: Date | null;
    title: string;
    description: string;
    plot_points: string[];
    imdb_summaries: string[];
    images: string[];
};

export type ShowModel = {
    tmdb_id: string;
    first_aired_at: Date | null;
    synced_at: Date | null;
    title: string;
    image: string | null;
    wikidata_id: string | null;
};

export type EpisodeModel = {
    tmdb_id: string;
    imdb_id: string;
    show_id: string;
    season: number;
    number: number;
    first_aired_at: Date | null;
    synced_at: Date | null;
    title: string;
    description: string;
    all_plot_points: string[];
    main_plot_points: string[];
    imdb_summaries: string[];
    imdb_synopsis: string[];
    images: string[];
    wikipedia_url: string | null;
    wikipedia_text: string | null;
};

export type MatrixModel = {
    id: string;
    show_id: string;
    created_at: Date;
    completed_at: Date | null;
};

export type ComparisonModel = {
    matrix_id: string;
    episode_a_id: string;
    episode_b_id: string;
    comparison: Comparison;
    created_at: Date;
};

export type GeneratePlotPointsJobData = {
    jobName: "generate-plot-points";
    showId: string;
    episodeId: string;
    imdbId: string;
};

export type SyncShowJobData = {
    jobName: "sync-show";
    tmdbId: string;
};

export type JobData = GeneratePlotPointsJobData | SyncShowJobData;

export function isGeneratePlotPointsJob(data: Job<JobData>): data is Job<GeneratePlotPointsJobData> {
    return data.data.jobName === "generate-plot-points";
}

export function isSyncShowJob(data: Job<JobData>): data is Job<SyncShowJobData> {
    return data.data.jobName === "sync-show";
}

// This is here because the library we rely on has an incorrect type definition.
export type TmdbExternalIds = {
    id: number;
    imdb_id: string | null;
    freebase_mid: string | null;
    freebase_id: string | null;
    tvdb_id: number | null;
    tvrage_id: number | null;
    wikidata_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
};

export interface BaseShowState {
    show: ShowSummary;
    synced: boolean;
    episodeCount: number | null;
    episodesSynced: number;
    details?: undefined | GetShowDetailsResponse;
}

export interface ShowStateWithoutMatrix extends BaseShowState {
    show: ShowSummary;
    synced: boolean;
    episodeCount: number | null;
    episodesSynced: number;
}

export interface ShowStateWithMatrix extends BaseShowState {
    synced: true;
    episodeCount: number;
    details: GetShowDetailsResponse;
}

export type GetShowStateResponse = ShowStateWithoutMatrix | ShowStateWithMatrix;
