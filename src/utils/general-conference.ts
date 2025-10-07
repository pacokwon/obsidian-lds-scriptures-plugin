import * as cheerio from "cheerio";
import { requestUrl } from "obsidian";
import { GenConTalkData } from "@/types";
import { buildAPIURL, cheerioFind } from "./api";
import { AUTHOR_QUERIES, AUTHOR_TITLE } from "./config";
import { parseURL } from "./urlparsing";

export async function fetchGenConTalk(
    url: string,
    method: "GET" | "POST" | "PATCH",
): Promise<GenConTalkData> {
    let title = "";
    let author: string[] = [];
    let content: string[] = [];
    let year = "";
    let month = "";
    let setting = "";
    let parsedData = parseURL(url);
    let lang = parsedData.queryParams.lang
        ? parsedData.queryParams.lang
        : "eng";

    if (parsedData.pathParts[1] !== "general-conference") {
        throw new Error(
            "This can only reference talks from General Conference.",
        );
    }

    const talkurl = buildAPIURL(lang, url);

    const response = await requestUrl({
        url: talkurl,
        method: method,
        headers: {},
    });
    if (response.status === 401 || response.status === 402) {
        return {
            title,
            author,
            content,
            year,
            month,
            setting,
        };
    }

    try {
        const $ = cheerio.load(response.json["content"]["body"]);
        title = response.json.meta.title
            ? response.json.meta.title
            : "Title Not Found."; // no need to search, the JSON holds the name.
        const authorElement = cheerioFind($, AUTHOR_QUERIES);
        const authorname = authorElement
            ? authorElement
                  .text()
                  .trim()
                  .replace(/^[B|b]y\s/, "")
            : "Author not found";
        const authorRoleElement = cheerioFind($, AUTHOR_TITLE);
        const authorrole = authorRoleElement
            ? authorRoleElement.text().trim()
            : "Author role not found";
        author.push(authorname);
        author.push(authorrole);

        if (parsedData.paragraphs) {
            const { start, end } = parsedData.paragraphs;
            const paragraphEnd = end !== undefined ? end : start;
            if (
                typeof start === "number" &&
                Number.isInteger(start) &&
                typeof paragraphEnd === "number" &&
                Number.isInteger(paragraphEnd)
            ) {
                for (let i = start; i <= paragraphEnd; i++) {
                    const paragraph = $(`#p${i}`).text()?.trim();
                    if (paragraph) {
                        content.push(paragraph);
                    } else {
                        console.warn(`Paragraph #${i} not found.`);
                    }
                }
            } else {
                const startId = typeof start === "string" ? start : `p${start}`;
                const endId =
                    typeof paragraphEnd === "string"
                        ? paragraphEnd
                        : `p${paragraphEnd}`;
                let collecting = false;
                $(".body-block")
                    .find("p, h1, h2, h3, h4, h5, h6")
                    .each((_, el) => {
                        const $el = $(el);
                        const elId = $el.attr("id");
                        if (elId === startId) {
                            collecting = true;
                        }
                        if (collecting && $el.text().trim()) {
                            content.push($el.text().trim());
                        }
                        if (elId === endId) {
                            collecting = false;
                        }
                    });
            }
        }

        year = parsedData.pathParts[2];
        month = parsedData.pathParts[3];
        setting = "General Conference";

        if (!title || !content) {
            throw new Error(
                "Unable to extract the necessary data from the webpage.",
            );
        }
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    return {
        title,
        author,
        content,
        year,
        month,
        setting,
    };
}
