import { Author } from "@/types";

export function findAuthor($: cheerio.Root): Author {
    // Try modern classes first
    let name = $(".author-name").first().text().trim();
    let role = $(".author-role").first().text().trim();

    // Structural fallback across eras
    if (!name) name = $("h1 + p").first().text().trim();
    if (!role) role = $("h1 + p + p").first().text().trim();

    return {
        name: name.replace(/^By\s+/i, "").trim(),
        role,
    };
}

export function queryBetweenIds(
    $: cheerio.Root,
    startId: string,
    endId: string,
) {
    const out: cheerio.Cheerio[] = [];
    let node = $(`#${startId}`);
    const end = $(`#${endId}`);
    if (!node.length || !end.length) return [];

    while (node.length) {
        out.push(node);
        if (node.is(end)) break;
        node = node.next();
    }
    return out;
}
