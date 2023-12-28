import getImdbPlotSummary from "@/utils/getImdbPlotSummary";
import generateEpisodePlotPoints from "@/utils/generateEpisodePlotPoints";

const main = async () => {
    const summary = await getImdbPlotSummary("tt0582437");
    const plot = await generateEpisodePlotPoints("Frasier", summary);

    console.log(summary);
    console.log(plot);
};

void main();
