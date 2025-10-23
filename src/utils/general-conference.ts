import { ConferenceTalkData } from "@/types";

export function toCalloutString(talk: ConferenceTalkData) {
    const { url, title, author, content, year, month } = talk;

    const header = `>[!gencon] [${title}](${url})`;
    const body = content.map((p) => `> ${p}`).join("\n>\n");
    const monthText = [month === 4 ? "April" : "October", year].join(" ");
    const attribution = [
        "[!genconcitation]",
        author.name,
        author.role,
        monthText,
    ]
        .map((s) => `>> ${s}`)
        .join("\n");

    return [header, body, attribution, ""].join("\n");
}
