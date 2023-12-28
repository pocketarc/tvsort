"use server";

import type { ComparisonModel, EpisodeModel, MatrixModel, Show, ShowModel } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import type { Comparison } from "@/utils/monkeySort";
import getShowImage from "@/utils/getShowImage";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";

export type GetShowDetailsResponse = {
    show: Show;
    matrixId: string;
    explicitCount: number;
    matrix: Record<string, Record<string, Comparison>>;
};

export type ShowMetadata = {
    title: string;
    image: string;
};

export const getShowDetails = async (matrixId: string, showId: string): Promise<GetShowDetailsResponse | undefined> => {
    const data: FormData = new FormData();
    data.append("matrixId", matrixId);
    data.append("showId", showId);

    return withServerActionInstrumentation(
        "findShows",
        {
            formData: data,
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            console.log("Getting show details for", showId);

            if (!process.env["TMDB_API_ACCESS_TOKEN"]) {
                throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
            }

            const knex = getKnex();

            const result = await knex<ShowModel>("shows").select().where("tmdb_id", showId).whereNotNull("synced_at").first();

            if (!result) {
                return undefined;
            }

            const episodes = await knex<EpisodeModel>("episodes").select().where("show_id", showId).orderBy("season").orderBy("number");

            const showDetails: Show = {
                id: result.tmdb_id,
                title: result.title,
                first_aired_at: result.first_aired_at,
                image: getShowImage(result.title, result.image),
                seasons: episodes
                    .filter((episode) => {
                        return episode.season !== 0;
                    })
                    .map((episode) => {
                        return {
                            number: episode.season,
                            episodes: [
                                {
                                    number: episode.number,
                                    title: episode.title,
                                    description: episode.description,
                                    first_aired_at: episode.first_aired_at,
                                    images: episode.images,
                                    season: episode.season,
                                    id: episode.tmdb_id,
                                    imdb_id: episode.imdb_id,
                                    imdb_summaries: episode.imdb_summaries,
                                    plot_points: episode.plot_points,
                                },
                            ],
                        };
                    }),
            };

            const matrixRecord = await knex<MatrixModel>("matrices").select().where("id", matrixId).first();

            if (!matrixRecord) {
                await knex<MatrixModel>("matrices").insert({
                    id: matrixId,
                    show_id: showId,
                });
            }

            const comparisons = await knex<ComparisonModel>("comparisons").where("matrix_id", matrixId);
            const matrix: Record<string, Record<string, Comparison>> = {};
            let explicitCount = 0;

            for (const comparison of comparisons) {
                if (!matrix[comparison.episode_a_id]) {
                    matrix[comparison.episode_a_id] = {};
                }

                if (!matrix[comparison.episode_b_id]) {
                    matrix[comparison.episode_b_id] = {};
                }

                // @ts-expect-error - It cannot be undefined; it's been set above.
                matrix[comparison.episode_a_id][comparison.episode_b_id] = comparison.comparison;
                // @ts-expect-error - It cannot be undefined; it's been set above.
                matrix[comparison.episode_b_id][comparison.episode_a_id] = comparison.comparison;

                explicitCount++;
            }

            return {
                show: showDetails,
                matrixId,
                explicitCount,
                matrix,
            };
        },
    );
};
