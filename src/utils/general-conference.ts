import * as cheerio from "cheerio";
import { requestUrl } from "obsidian";
import { GenConTalkData } from "@/types";
import { getResourceURL } from "./api";
import { findAuthor, queryBetweenIds } from "./dom";
import { ParagraphKind, parseURL, ResourceKind } from "./url";

export async function fetchGenConTalk(_url: string): Promise<GenConTalkData> {
    let setting = "";
    const url = parseURL(_url);

    if (url.kind !== ResourceKind.ConferenceTalk)
        throw new Error(
            `The url ${url.fullPath} does not point to a general conference talk. Aborting.`,
        );

    const resourceUrl = getResourceURL(url);

    const response = await requestUrl({
        url: resourceUrl,
        method: "GET",
        headers: {},
    });

    if (response.status > 400)
        throw new Error(
            `Request to general conference talk: ${resourceUrl} failed with status code ${response.status}`,
        );

    const $ = cheerio.load(response.json.content.body);
    const title = response.json.meta.title ?? "Title Not Found.";
    const author = findAuthor($);

    const match = url.resourcePath.match(/^(\d+)\/(\d+)/);
    if (match === null)
        throw new Error(
            `General Conference talk URL malformed. Could not extract year and month. ${url.fullPath}`,
        );

    const [_, year, month] = match;

    const content = url.paragraphs.flatMap((p) => {
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

    setting = "General Conference";

    if (!title || !content)
        throw new Error(
            "Unable to extract the necessary data from the webpage.",
        );

    return {
        title,
        author,
        content,
        year,
        month,
        setting,
    };
}
