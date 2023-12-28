import getKnex from "@/utils/getKnex";
import type { ShowModel } from "@/utils/types";
import getShowImage from "@/utils/getShowImage";
import { TMDB } from "tmdb-ts";
import { parse as parseDate } from "date-fns/parse";
import type { ShowMetadata } from "@/server/getShowDetails";

export const getShowMetadata = async (showId: string): Promise<ShowMetadata> => {
    const knex = getKnex();
    const result = await knex<ShowModel>("shows").select().where("tmdb_id", showId).first();

    if (result) {
        return {
            image: getShowImage(result.title, result.image),
            title: result.title,
        };
    } else {
        if (!process.env["TMDB_API_ACCESS_TOKEN"]) {
            throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
        }

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

        return {
            image: getShowImage(show.name, showImage),
            title: show.name,
        };
    }
};
