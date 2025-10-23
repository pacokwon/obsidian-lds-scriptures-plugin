import { Author } from "@/types";

export function findAuthor(root: ParentNode = document): Author {
    const getText = (sel: string): string =>
        (root.querySelector(sel)?.textContent ?? "").trim();

    // Try modern classes first
    let name = getText(".author-name");
    let role = getText(".author-role");

    // Structural fallback across eras
    if (!name) name = getText("h1 + p");
    if (!role) role = getText("h1 + p + p");

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
