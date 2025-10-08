import * as cheerio from "cheerio";
import { requestUrl } from "obsidian";
import { ScriptureData } from "@/types";
import { getResourceURL } from "./api";
import { queryBetweenIds } from "./dom";
import { ParagraphKind, parseURL, ResourceKind } from "./url";

export async function fetchScripture(_url: string): Promise<ScriptureData> {
    const url = parseURL(_url);
    if (url.kind !== ResourceKind.Scriptures)
        throw new Error(
            `The url ${url.fullPath} does not point to a scripture. Aborting.`,
        );

    const resourceUrl = getResourceURL(url);

    // request to API
    const response = await requestUrl({
        url: resourceUrl,
        method: "GET",
        headers: {},
    });

    if (response.status > 400)
        throw new Error(
            `Request to scripture: ${resourceUrl} failed with status code ${response.status}`,
        );

    const $ = cheerio.load(response.json.content.body);
    const nativeBookTitle = response.json.meta.title;
    const [book, chapter] = nativeBookTitle.split(" ");

    const verses = url.paragraphs.flatMap((p) => {
        if (p.kind === ParagraphKind.Single) {
            return [$(`#${p.id}`).text().trim()];
        } else if (p.kind === ParagraphKind.Range) {
            // since right here we're only dealing with scripture, we can
            // take advantage of the fact that the id is p<n> where <n> is a number,
            // but we just use queryBetweenIds, a more generic solution
            return queryBetweenIds($, p.start, p.end).map((e) =>
                e.text().trim(),
            );
        } else {
            return [];
        }
    });

    return {
        book,
        chapter,
        verses,
        nativeBookTitle,
    };
}
