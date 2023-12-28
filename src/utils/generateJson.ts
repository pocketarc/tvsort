import { OpenAI } from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "@/utils/zodToJsonSchema";
import { parseUnsafeJson } from "@/utils/parseUnsafeJson";

export default async function generateJson<Output>(
    schema: z.ZodType<Output>,
    systemPrompt: string,
    messages: OpenAI.ChatCompletionMessageParam[],
    attempt = 1,
): Promise<Output> {
    if (!process.env["OPENAI_API_KEY"] || !process.env["OPENAI_ORGANIZATION_ID"]) {
        throw new Error("OPENAI_API_KEY or OPENAI_ORGANIZATION_ID is not set.");
    }

    const client = new OpenAI({
        organization: process.env["OPENAI_ORGANIZATION_ID"],
        apiKey: process.env["OPENAI_API_KEY"],
    });

    const format = JSON.stringify(zodToJsonSchema(schema));

    const fullSystemPrompt = `You are an assistant who can ONLY respond in JSON. You respond with the following JSON schema specifications:
${format}

${systemPrompt}
`;

    console.log(`Calling OpenAI API...`);
    const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        response_format: {
            type: "json_object",
        },
        messages: [
            {
                role: "system",
                content: fullSystemPrompt,
            },
            ...messages,
        ],
    });

    try {
        if (response.choices[0]?.message.content) {
            const object = parseUnsafeJson(response.choices[0]?.message.content);
            if (object) {
                return schema.parse(object);
            } else {
                throw new Error(`Could not parse JSON. Response received was: ${response.choices[0].message.content}`);
            }
        } else {
            throw new Error(`Could not parse JSON. No response received.`);
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(`Error parsing JSON: ${e}`);
            console.log([
                ...messages,
                {
                    role: "assistant",
                    content: response.choices[0]?.message.content ?? "",
                },
                {
                    role: "system",
                    content: e.message,
                },
            ]);

            if (attempt < 3) {
                return generateJson(
                    schema,
                    systemPrompt,
                    [
                        ...messages,
                        {
                            role: "assistant",
                            content: response.choices[0]?.message.content ?? "",
                        },
                        {
                            role: "system",
                            content: e.message,
                        },
                    ],
                    attempt + 1,
                );
            } else {
                throw e;
            }
        } else {
            throw e;
        }
    }
}
