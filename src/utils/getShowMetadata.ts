import getKnex from "@/utils/getKnex";
import getShowImage from "@/utils/getShowImage";
import type { ShowMetadata } from "@/server/getShowDetails";
import getShowRecord from "@/utils/getShowRecord";

export const getShowMetadata = async (showId: string): Promise<ShowMetadata> => {
    const knex = getKnex();
    const result = await getShowRecord(knex, showId);
    return {
        image: getShowImage(result.title, result.image),
        title: result.title,
    };
};
