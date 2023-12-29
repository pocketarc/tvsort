import { parse } from "node-html-parser";

type WikipediaData = {
    url: string | null;
    text: string | null;
};

export async function getWikipediaUrlFromImdbId(imdbId: string): Promise<string | null> {
    const endpointUrl = "https://query.wikidata.org/sparql";
    const sparqlQuery = `SELECT ?wppage WHERE {                                                          
?subject wdt:P345 '${imdbId}' .                                                   
  ?wppage schema:about ?subject .                                               
  FILTER(contains(str(?wppage),'//en.wikipedia'))                               
}`;

    const fullUrl = `${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`;
    const headers = {
        Accept: "application/sparql-results+json",
        "User-Agent": "TVSort/1.0 (https://tvsort.com/about/; hello@pocketarc.com) tvsort/1.0",
    };

    const response = await fetch(fullUrl, { headers });

    try {
        const data = await response.json();
        return data.results.bindings[0]?.wppage.value ?? null;
    } catch (e) {
        console.log("response", response);
        console.error(e);
        return null;
    }
}

export async function getWikipediaSeasonUrlFromShow(showName: string, seasonNumber: number): Promise<string | null> {
    const showNameWithUnderscores = showName.replace(" ", "_");
    const seasonName = `season_${seasonNumber}`;
    const url = `https://en.wikipedia.org/wiki/${showNameWithUnderscores}_(${seasonName})`;

    const headers = {
        "User-Agent": "TVSort/1.0 (https://tvsort.com/about/; hello@pocketarc.com) tvsort/1.0",
    };
    const response = await fetch(url, { headers });
    const text = await response.text();

    if (text.includes(`List of ${showName} episodes`)) {
        return url;
    } else {
        return null;
    }
}

export async function getWikipediaData(imdbId: string, showName: string, seasonNumber: number, episodeNumber: number): Promise<WikipediaData> {
    const wikipediaUrl = await getWikipediaUrlFromImdbId(imdbId);

    if (wikipediaUrl) {
        const response = await fetch(wikipediaUrl);
        const text = await response.text();
        const root = parse(text);

        const plot = root.querySelector("#Plot")?.parentNode;

        // Get all p tags until the next h2.
        const plotPoints = [];

        if (plot) {
            let currentElement = plot.nextElementSibling;

            while (currentElement?.tagName === "P") {
                plotPoints.push(currentElement.text.trim());
                currentElement = currentElement.nextElementSibling;
            }
        }

        return {
            url: wikipediaUrl,
            text: plotPoints.join("\n"),
        };
    } else {
        const wikipediaSeasonUrl = await getWikipediaSeasonUrlFromShow(showName, seasonNumber);

        if (wikipediaSeasonUrl) {
            const response = await fetch(wikipediaSeasonUrl);
            const text = await response.text();
            const root = parse(text);

            for (const tr of root.querySelectorAll(".wikiepisodetable .vevent")) {
                const nextTr = tr.nextElementSibling;

                if (!nextTr) {
                    throw new Error("No next tr? This is unexpected. Current tr: " + tr.toString());
                }

                const detectedEpisodeNumber = tr.querySelector("td:nth-child(2)")?.text.trim();
                const episodeDescription = nextTr.querySelector("td")?.text.trim();

                if (episodeNumber === parseInt(detectedEpisodeNumber ?? "", 10)) {
                    return {
                        url: wikipediaSeasonUrl,
                        text: episodeDescription ?? null,
                    };
                }
            }

            return {
                url: wikipediaSeasonUrl,
                text: null,
            };
        } else {
            return {
                url: null,
                text: null,
            };
        }
    }
}
