import * as cheerio from "cheerio";
import { requestUrl } from "obsidian";
import { ScriptureData } from "@/types";
import { buildAPIURL } from "./api";
import { PARAGRAPHS_IN_BODY_QUERY } from "./config";
import { parseURL } from "./urlparsing";

export async function fetchScripture(
    url: string,
    method: "GET" | "POST" | "PATCH",
): Promise<ScriptureData> {
    let book = "";
    let inLanguageBook = "";
    let chapter = 0;
    let verses: Map<string, string> = new Map();

    let parsedData = parseURL(url);

    let lang = parsedData.queryParams.lang
        ? parsedData.queryParams.lang
        : "eng";

    if (parsedData.pathParts[1] !== "scriptures") {
        throw new Error("This can only reference scripture verses.");
    }
    let apiurl = buildAPIURL(lang, url);

    // request to API
    const response = await requestUrl({
        url: apiurl,
        method: method,
        headers: {},
    });

    if (response.status === 401 || response.status === 402) {
        return {
            book,
            chapter,
            verses,
            inLanguageBook,
        };
    }

    try {
        const $ = cheerio.load(response.json["content"]["body"]);
        [book, chapter] = response.json["meta"]["title"].split(" ");
        inLanguageBook = response.json["meta"]["title"];

        $(PARAGRAPHS_IN_BODY_QUERY.name).each((_, el) => {
            const id = $(el).attr("id");
            if (id) {
                // Only include elements that have an ID
                verses.set(id, $(el).text().trim());
            }
        });
    } catch (error) {
        console.error("Error occured: ", error);
    }

    return {
        book,
        chapter,
        verses,
        inLanguageBook,
    };
}
