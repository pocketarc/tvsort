import { z } from "zod";
import generateJson from "@/utils/generateJson";
import * as Sentry from "@sentry/nextjs";
import type { EpisodeModel, ShowModel } from "@/utils/types";

const generateEpisodePlotPoints = async (show: ShowModel, episode: EpisodeModel): Promise<string[]> => {
    console.log(`Generating plot points for ${show.tmdb_id} (${show.title})...`);

    const zodSchema = z.object({
        type: z.literal("object"),
        plot_points: z.array(z.string()),
    });

    const summaries = [episode.description, ...episode.imdb_summaries];

    // We do this because sometimes one of the IMDB summaries matches the episode description.
    const uniqueSummaries = [...new Set(summaries)];

    const summary = uniqueSummaries.join(" ").trim();
    const prompt = `Generate a short list of all the different plot points mentioned in the given episode summaries of the show "${show.title}". Use very short sentences.`;

    try {
        const response = await generateJson(zodSchema, prompt, [
            {
                role: "user",
                content: summary,
            },
        ]);

        console.log(`Grabbed all points. Now grabbing the 3 most different points...`);

        const result = await generateJson(zodSchema, prompt, [
            {
                role: "user",
                content: summary,
            },
            {
                role: "assistant",
                content: JSON.stringify(response),
            },
            {
                role: "user",
                content: "List the 3 most different points. Use much shorter sentences.",
            },
        ]);

        return result.plot_points.map((plotPoint) => {
            plotPoint = plotPoint.trim();

            // Add a period at the end of the sentence if it doesn't already have one.
            if (!plotPoint.endsWith(".")) {
                plotPoint += ".";
            }

            return plotPoint;
        });
    } catch (error) {
        Sentry.captureException(error);
        return [];
    }
};

export default generateEpisodePlotPoints;
