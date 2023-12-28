import getImdbPlotSummary from "@/utils/getImdbPlotSummary";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";
import type { EpisodeModel, ShowModel } from "@/utils/types";

const main = async () => {
    const summaries = await getImdbPlotSummary("tt0582437");

    const show: ShowModel = {
        tmdb_id: "123",
        first_aired_at: null,
        synced_at: null,
        episode_count: null,
        title: "Frasier",
        image: null,
    };

    const episode: EpisodeModel = {
        tmdb_id: "123",
        imdb_id: "123",
        show_id: "123",
        season: 1,
        number: 1,
        first_aired_at: null,
        synced_at: null,
        title: "The Good Son",
        description: "",
        plot_points: [],
        imdb_summaries: summaries,
        images: [],
    };

    const plot = await generateEpisodePlotPoints(show, episode);

    console.log(summaries);
    console.log(plot);
};

void main();
