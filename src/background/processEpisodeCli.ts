import fetchAndInsertEpisode from "@/utils/fetchAndInsertEpisode";
import getKnex from "@/utils/getKnex";
import processEpisode from "@/utils/processEpisode";
import type { EpisodeModel } from "@/utils/types";

const showId = process.argv[2];
const season = process.argv[3] ? Number.parseInt(process.argv[3], 10) : null;
const episodeNumber = process.argv[4] ? Number.parseInt(process.argv[4], 10) : null;

if (!showId || !season || !episodeNumber) {
    console.error("Usage: bun run process-episode <show_tmdb_id> <season> <episode_number>");
    process.exit(1);
}

const knex = getKnex();

try {
    // Check if episode exists in database
    let episode: EpisodeModel | undefined = await knex<EpisodeModel>("episodes")
        .where({ show_id: showId, season, number: episodeNumber })
        .first();

    // If not, fetch from TMDB and insert
    if (!episode) {
        console.log("Episode not found in database, fetching from TMDB...");
        episode = await fetchAndInsertEpisode(knex, showId, season, episodeNumber);
    }

    // Process the episode
    await processEpisode(knex, episode.tmdb_id);
} catch (error) {
    console.error("Error processing episode:", error);
    process.exit(1);
} finally {
    await knex.destroy();
}
