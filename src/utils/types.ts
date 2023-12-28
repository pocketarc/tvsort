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
    images: string[];
};

export type ShowModel = {
    tmdb_id: string;
    first_aired_at: Date | null;
    synced_at: Date;
    title: string;
    image: string | null;
};

export type EpisodeModel = {
    tmdb_id: string;
    imdb_id: string;
    show_id: string;
    season: number;
    number: number;
    first_aired_at: Date | null;
    title: string;
    description: string;
    plot_points: string[];
    images: string[];
};

export type MatrixModel = {
    id: string;
    show_id: string;
    created_at: Date;
};

export type ComparisonModel = {
    matrix_id: string;
    episode_a_id: string;
    episode_b_id: string;
    comparison: Comparison;
    created_at: Date;
};
