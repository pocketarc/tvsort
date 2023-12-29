import { parse } from "node-html-parser";

type ImdbData = {
    summaries: string[];
    synopsis: string[];
};

export default async function getImdbData(imdbId: string): Promise<ImdbData> {
    console.log(`Fetching plot summary for ${imdbId}...`);
    const response = await fetch(`https://www.imdb.com/title/${imdbId}/plotsummary`);
    const text = await response.text();
    const root = parse(text);

    // Get the plot summaries
    const summaryElements = root.querySelectorAll('[data-testid="sub-section-summaries"] .ipc-html-content-inner-div');
    const summaries = summaryElements.map((element) => element.text.trim());

    // Get the synopsis
    const synopsisElements = root.querySelectorAll('[data-testid="sub-section-synopsis"] .ipc-html-content-inner-div');
    const synopsis = synopsisElements.map((element) => element.text.trim());

    return {
        summaries,
        synopsis,
    };
}
