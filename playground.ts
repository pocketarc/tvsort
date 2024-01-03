import getImdbData from "@/utils/getImdbData";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import type { EpisodeModel, ShowModel } from "@/utils/types";
import { getWikipediaData } from "@/utils/getWikipediaData";

const main = async () => {
    const imdbId = "tt0582423";
    const showWikidataId = "Q209282";
    const showName = "Frasier";
    const season = 1;
    const number = 5;

    const summaries = await getImdbData(imdbId);
    const wikipedia = await getWikipediaData(imdbId, showWikidataId, season, number);

    console.log("Wikipedia data", wikipedia);
    console.log("IMDB data", summaries);

    const show: ShowModel = {
        tmdb_id: "123",
        first_aired_at: null,
        synced_at: null,
        title: showName,
        wikidata_id: showWikidataId,
        image: null,
    };

    const episode: EpisodeModel = {
        tmdb_id: "123",
        imdb_id: imdbId,
        show_id: "123",
        season,
        number,
        first_aired_at: null,
        synced_at: null,
        title: "",
        description: "",
        main_plot_points: [],
        all_plot_points: [],
        imdb_summaries: summaries.summaries,
        imdb_synopsis: summaries.synopsis,
        wikipedia_text: wikipedia.text,
        wikipedia_url: wikipedia.url,
        images: [],
    };

    const plot = await generateEpisodePlotPoints(show, episode);

    console.log(plot);
};

void main();
