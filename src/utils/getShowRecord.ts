import type { ShowModel } from "@/utils/types";
import getKnex from "@/utils/getKnex";
import { TMDB } from "tmdb-ts";
import { parse as parseDate } from "date-fns/parse";
import type { Knex } from "knex";

export default async function getShowRecord(knex: Knex, tmdbId: string): Promise<ShowModel> {
    if (!process.env["TMDB_API_ACCESS_TOKEN"]) {
        throw new Error("TMDB_API_ACCESS_TOKEN is not set.");
    }

    let record = await knex<ShowModel>("shows").where("tmdb_id", tmdbId).first();

    if (!record) {
        const tmdb = new TMDB(process.env["TMDB_API_ACCESS_TOKEN"]);
        const show = await tmdb.tvShows.details(parseInt(tmdbId));
        const knex = getKnex();

        const showImage = show.poster_path ? `https://image.tmdb.org/t/p/w342/${show.poster_path}` : null;

        const records = await knex<ShowModel>("shows")
            .insert({
                tmdb_id: show.id.toString(),
                title: show.name,
                first_aired_at: show.first_air_date ? parseDate(show.first_air_date, "yyyy-MM-dd", new Date()) : null,
                image: showImage,
            })
            .onConflict("tmdb_id")
            .ignore()
            .returning("*");

        if (records[0]) {
            record = records[0];
        } else {
            throw new Error("Failed to insert show record.");
        }
    }

    return record;
}
