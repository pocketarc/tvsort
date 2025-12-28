import jsonic from "jsonic";
import { jsonrepair } from "jsonrepair";

const extractJSONObjectResponse = (res: string): string | undefined =>
    res.match(/\{(.|\n)*}/g)?.[0];

const extractJSONArrayResponse = (res: string): string | undefined =>
    res.match(/\[(.|\n)*]/g)?.[0];

export function parseUnsafeJson(json: string): object | null {
    try {
        const potentialArray = extractJSONArrayResponse(json);
        const potentialObject = extractJSONObjectResponse(json);
        // extract the larger text between potential array and potential object, we want the parent json object
        const extracted =
            (potentialArray?.length ?? 0) > (potentialObject?.length ?? 0)
                ? potentialArray
                : potentialObject;
        if (extracted) {
            return jsonic(jsonrepair(extracted));
        } else {
            return null;
        }
    } catch (_e) {
        return null;
    }
}
