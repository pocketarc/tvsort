import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import generateJson from "@/utils/generateJson";
import type { EpisodeModel, ShowModel } from "@/utils/types";

type EpisodePlotPoints = {
    all_points: string[];
    main_points: string[];
};

export default async function generateEpisodePlotPoints(
    show: ShowModel,
    episode: EpisodeModel,
): Promise<EpisodePlotPoints> {
    console.log(
        `Generating plot points for ${show.tmdb_id} (${show.title})...`,
    );

    const zodSchema = z.object({
        plot_points: z.array(z.string()),
    });

    const summaries = [
        episode.description,
        ...episode.imdb_summaries,
        ...episode.imdb_synopsis,
        episode.wikipedia_text,
    ];

    // We do this because sometimes one of the IMDB summaries matches the episode description.
    const uniqueSummaries = [...new Set(summaries)];

    const summary = uniqueSummaries.join("\n").trim();
    const prompt = `Generate a short list of all the different plot points mentioned in the given episode summaries of the show "${show.title}". Use very short sentences. The goal of this list is to jog someone's memory of this episode. Therefore, focus on the most unique and memorable plot points - names, places, and events that stand out.`;

    try {
        const allPoints = await generateJson(zodSchema, prompt, [
            {
                role: "user",
                content: summary,
            },
        ]);

        console.log(
            `Grabbed all points. Now grabbing the 3 most different points...`,
        );

        let mainPoints = await generateJson(zodSchema, prompt, [
            {
                role: "user",
                content: summary,
            },
            {
                role: "assistant",
                content: JSON.stringify(allPoints),
            },
            {
                role: "user",
                content:
                    "List the 3 most different points. Use much shorter sentences.",
            },
        ]);

        if (mainPoints.plot_points.join("").length > 275) {
            console.log(
                `The plot points are too long. Generating shorter points...`,
            );

            mainPoints = await generateJson(zodSchema, prompt, [
                {
                    role: "user",
                    content: summary,
                },
                {
                    role: "assistant",
                    content: JSON.stringify(allPoints),
                },
                {
                    role: "user",
                    content:
                        "List the 3 most different points. Use much shorter sentences.",
                },
                {
                    role: "assistant",
                    content: JSON.stringify(mainPoints),
                },
                {
                    role: "user",
                    content: "Too long; make it shorter.",
                },
            ]);
        }

        const cleanUp = (plotPoint: string) => {
            plotPoint = plotPoint.trim();

            // Add a period at the end of the sentence if it doesn't already have one.
            if (!plotPoint.endsWith(".")) {
                plotPoint += ".";
            }

            return plotPoint;
        };

        return {
            all_points: allPoints.plot_points.map(cleanUp),
            main_points: mainPoints.plot_points.map(cleanUp),
        };
    } catch (error) {
        Sentry.captureException(error);
        return {
            all_points: [],
            main_points: [],
        };
    }
}
