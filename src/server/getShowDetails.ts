"use server";

import type { ComparisonModel, Episode, EpisodeModel, MatrixModel, Show, ShowModel } from "@/utils/types";
import { TMDB } from "tmdb-ts";
import type { Image, Images } from "tmdb-ts/dist/types";
import getKnex from "@/utils/getKnex";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import getImdbPlotSummary from "@/utils/getImdbPlotSummary";
import { parse as parseDate } from "date-fns";
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

export const getShowDetails = async (matrixId: string, showId: string): Promise<GetShowDetailsResponse> => {
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
            let showDetails: Show;

            if (result) {
                const episodes = await knex<EpisodeModel>("episodes").select().where("show_id", showId);

                showDetails = {
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
                                        plot_points: episode.plot_points,
                                    },
                                ],
                            };
                        }),
                };
            } else {
                console.log("Fetching from TMDB");
                const tmdb = new TMDB(process.env["TMDB_API_ACCESS_TOKEN"]);
                const show = await tmdb.tvShows.details(parseInt(showId));

                const showImage = show.poster_path ? `https://image.tmdb.org/t/p/w342/${show.poster_path}` : null;

                await knex<ShowModel>("shows")
                    .insert({
                        tmdb_id: show.id.toString(),
                        title: show.name,
                        first_aired_at: parseDate(show.first_air_date, "yyyy-MM-dd", new Date()),
                        image: showImage,
                    })
                    .onConflict("tmdb_id")
                    .ignore();

                const details = {
                    id: show.id.toString(),
                    title: show.name,
                    first_aired_at: new Date(show.first_air_date),
                    image: getShowImage(show.name, showImage),
                    seasons: await Promise.all(
                        show.seasons
                            .filter((season) => {
                                return season.season_number !== 0;
                            })
                            .map(async (season) => {
                                console.log("Fetching season", season.season_number);

                                const episodes: Episode[] = [];

                                for (let i = 1; i <= season.episode_count; i++) {
                                    console.log("Fetching episode", i);

                                    const episodeRecord = await knex<EpisodeModel>("episodes")
                                        .select()
                                        .where("show_id", showId)
                                        .where("season", season.season_number)
                                        .where("number", i)
                                        .first();

                                    if (episodeRecord) {
                                        episodes.push({
                                            number: episodeRecord.number,
                                            title: episodeRecord.title,
                                            description: episodeRecord.description,
                                            first_aired_at: episodeRecord.first_aired_at,
                                            images: episodeRecord.images,
                                            season: episodeRecord.season,
                                            id: episodeRecord.tmdb_id,
                                            imdb_id: episodeRecord.imdb_id,
                                            plot_points: episodeRecord.plot_points,
                                        });
                                    } else {
                                        const episode = await tmdb.tvEpisode.details(
                                            {
                                                tvShowID: show.id,
                                                seasonNumber: season.season_number,
                                                episodeNumber: i,
                                            },
                                            ["external_ids", "images"],
                                        );

                                        const allEpisodeImages: Images & { stills?: Image[] } = episode.images as Images & { stills?: Image[] };
                                        const images = allEpisodeImages.stills?.map((still) => `https://image.tmdb.org/t/p/w300/${still.file_path}`) ?? [];

                                        let plotPoints: string[] = [];

                                        if (episode.external_ids.imdb_id) {
                                            plotPoints = await generateEpisodePlotPoints(show.name, await getImdbPlotSummary(episode.external_ids.imdb_id));
                                        }

                                        const data: Episode = {
                                            number: episode.episode_number,
                                            title: episode.name,
                                            description: episode.overview,
                                            first_aired_at: new Date(episode.air_date),
                                            images,
                                            season: season.season_number,
                                            id: episode.id.toString(),
                                            imdb_id: episode.external_ids.imdb_id,
                                            plot_points: plotPoints,
                                        };

                                        console.log("Storing plot points", data.plot_points);
                                        console.log({
                                            tmdb_id: data.id,
                                            show_id: show.id.toString(),
                                            season: data.season,
                                            number: data.number,
                                            title: data.title,
                                            description: data.description,
                                            first_aired_at: data.first_aired_at,
                                            images: data.images,
                                            imdb_id: data.imdb_id,
                                            plot_points: data.plot_points,
                                        });

                                        await knex<EpisodeModel>("episodes")
                                            .insert({
                                                tmdb_id: data.id,
                                                show_id: show.id.toString(),
                                                season: data.season,
                                                number: data.number,
                                                title: data.title,
                                                description: data.description,
                                                first_aired_at: data.first_aired_at,
                                                images: JSON.stringify(data.images) as unknown as string[],
                                                imdb_id: data.imdb_id,
                                                plot_points: JSON.stringify(data.plot_points) as unknown as string[],
                                            })
                                            .onConflict("tmdb_id")
                                            .ignore();

                                        episodes.push(data);
                                    }
                                }

                                return {
                                    number: season.season_number,
                                    episodes,
                                };
                            }),
                    ),
                };

                await knex<ShowModel>("shows")
                    .update({
                        synced_at: new Date(),
                    })
                    .where("tmdb_id", show.id.toString());

                showDetails = details;
            }

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
