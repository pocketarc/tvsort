import { omit } from "lodash-es";
import type { z } from "zod";
import { zodToJsonSchema as zodToJsonSchemaImpl } from "zod-to-json-schema";

export function zodToJsonSchema(schema: z.ZodType): object {
    return omit(
        zodToJsonSchemaImpl(schema, { $refStrategy: "none" }),
        "$ref",
        "$schema",
        "default",
        "definitions",
        "description",
        "markdownDescription",
    );
}
