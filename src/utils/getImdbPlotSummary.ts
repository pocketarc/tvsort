import { parse } from "node-html-parser";

const getImdbPlotSummary = async (imdbId: string): Promise<string> => {
    console.log(`Fetching plot summary for ${imdbId}...`);
    const response = await fetch(`https://www.imdb.com/title/${imdbId}/plotsummary`);
    const text = await response.text();
    const root = parse(text);
    const elements = root.querySelectorAll('[data-testid="sub-section-summaries"] .ipc-html-content-inner-div');
    const summaries = elements.map((element) => element.text.trim());
    return summaries.join("\n---\n");
};

export default getImdbPlotSummary;
