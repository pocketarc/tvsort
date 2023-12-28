import { OpenAI } from "openai";
import { parseUnsafeJson } from "@/utils/parseUnsafeJson";
import { zodToJsonSchema } from "@/utils/zodToJsonSchema";
import { z } from "zod";

const generateEpisodePlotPoints = async (show: string, summary: string): Promise<string[]> => {
    console.log(`Generating plot points for ${show}...`);

    if (!process.env["OPENAI_API_KEY"] || !process.env["OPENAI_ORGANIZATION_ID"]) {
        throw new Error("OPENAI_API_KEY or OPENAI_ORGANIZATION_ID is not set.");
    }

    const client = new OpenAI({
        organization: process.env["OPENAI_ORGANIZATION_ID"],
        apiKey: process.env["OPENAI_API_KEY"],
    });

    const zodSchema = z.array(z.string());

    const format = JSON.stringify(zodToJsonSchema(zodSchema));

    const systemPrompt = `You are an assistant who can ONLY respond in JSON. You respond with the following JSON schema specifications:
${format}

Generate a short list of 3 different plot points in the given episodes of the show "${show}", very short sentences.
`;

    const response = await client.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: summary,
            },
        ],
    });

    if (response.choices[0]?.message.content) {
        const object = parseUnsafeJson(response.choices[0].message.content);
        if (object) {
            return zodSchema.parse(object);
        } else {
            throw new Error(`Could not parse JSON. Response received was: ${response.choices[0].message.content}`);
        }
    } else {
        return [];
    }
};

export default generateEpisodePlotPoints;
