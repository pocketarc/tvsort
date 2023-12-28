"use server";

import type { EpisodeModel, ShowModel, ShowSummary, SyncShowJobData } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";
import { getShowDetails, type GetShowDetailsResponse } from "@/server/getShowDetails";
import getPgBoss from "@/utils/getPgBoss";

export type GetShowStateResponse = {
    show: ShowSummary;
    synced: boolean;
    episodeCount: number | null;
    episodesSynced: number;
    details?: GetShowDetailsResponse;
};

export const getShowState = async (matrixId: string, showId: string): Promise<GetShowStateResponse> => {
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
        async (): Promise<GetShowStateResponse> => {
            console.log("Getting show state for", showId);

            const knex = getKnex();
            const result = await knex<ShowModel>("shows").select().where("tmdb_id", showId).first();

            if (!result) {
                return {
                    show: {
                        id: showId,
                        title: "Unknown",
                        image: getShowImage("Unknown", null),
                        first_aired_at: null,
                    },
                    synced: false,
                    episodeCount: null,
                    episodesSynced: 0,
                };
            }

            const buffer = await knex<EpisodeModel>("episodes").select().where("show_id", showId).count();
            let episodesSynced = buffer[0]?.["count"];

            if (typeof episodesSynced !== "number") {
                episodesSynced = 0;
            }

            const data = {
                synced: result.synced_at !== null,
                show: {
                    id: showId,
                    title: result.title,
                    image: getShowImage(result.title, result.image),
                    first_aired_at: result.first_aired_at,
                },
                episodesSynced: episodesSynced,
                episodeCount: result.episode_count,
            } satisfies Partial<GetShowStateResponse>;

            if (result.synced_at) {
                const details = await getShowDetails(matrixId, showId);

                if (details) {
                    console.log("Show is synced, sending back details.");
                    return {
                        ...data,
                        details,
                    };
                }
            }

            const boss = await getPgBoss();
            const jobData: SyncShowJobData = {
                jobName: "sync-show",
                tmdbId: showId,
            };

            const jobId = await boss.send("default", jobData);

            console.log(`Sent sync-show job ${jobId}`);
            console.log("Show isn't synced yet, sending back summary.");
            return data;
        },
    );
};
