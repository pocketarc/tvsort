import type { Knex } from "knex";
import getShowImage from "@/utils/getShowImage";
import getShowRecord from "@/utils/getShowRecord";
import type { EpisodeModel, ShowStateWithoutMatrix } from "@/utils/types";

type QueryResult = Array<{
    total: number;
    synced: number;
}>;

export const getShowStateWithoutMatrix = async (
    knex: Knex,
    showId: string,
): Promise<ShowStateWithoutMatrix> => {
    const result = await getShowRecord(knex, showId);

    const buffer = await knex<EpisodeModel>("episodes")
        .select<QueryResult>(
            knex.raw(
                "count(*) as total, sum(case when synced_at is null then 0 else 1 end) as synced",
            ),
        )
        .where("show_id", showId);

    const episodeCount = buffer[0]?.total ?? null;
    const episodesSynced = buffer[0]?.synced ?? 0;

    return {
        synced: result.synced_at !== null,
        show: {
            id: showId,
            title: result.title,
            image: getShowImage(result.title, result.image),
            first_aired_at: result.first_aired_at,
        },
        episodesSynced: episodesSynced,
        episodeCount: episodeCount,
    };
};
