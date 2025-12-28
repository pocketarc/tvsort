import { OpenRouter } from "@openrouter/sdk";
import { z } from "zod";

// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const openrouterApiKey = process.env["OPENROUTER_API_KEY"];
// biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
const openrouterModel = process.env["OPENROUTER_MODEL"] || "google/gemini-3-flash-preview";

const client = new OpenRouter({
    apiKey: openrouterApiKey,
});

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

function getContentAsString(content: string | Array<{ type: string; text?: string }> | null | undefined): string {
    if (!content) return "";
    if (typeof content === "string") return content;
    return content
        .filter((item) => item.type === "text" && item.text)
        .map((item) => item.text)
        .join("");
}

export default async function generateJson<Output>(
    schema: z.ZodType<Output>,
    systemPrompt: string,
    messages: ChatMessage[],
): Promise<Output> {
    if (!openrouterApiKey) {
        throw new Error("OPENROUTER_API_KEY is not set.");
    }

    const jsonSchema = z.toJSONSchema(schema, { unrepresentable: "any" });

    console.log("Calling OpenRouter API...");
    const response = await client.chat.send({
        model: openrouterModel,
        stream: false,
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...messages,
        ],
        responseFormat: {
            type: "json_schema",
            jsonSchema: {
                name: "Response",
                schema: jsonSchema,
            },
        },
        plugins: [{ id: "response-healing" }],
    });

    const responseContent = getContentAsString(response.choices[0]?.message.content);

    if (!responseContent) {
        throw new Error("No response content received from OpenRouter.");
    }

    const parsed = JSON.parse(responseContent);
    return schema.parse(parsed);
}
