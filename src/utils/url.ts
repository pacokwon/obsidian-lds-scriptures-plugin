import { AvailableLanguage, isAvailableLanguage } from "@/lang";

export enum ResourceKind {
    Scriptures = "scriptures",
    ConferenceTalk = "general-conference",
}

export enum ParagraphKind {
    Single,
    Range,
}

export type Paragraph =
    | {
          kind: ParagraphKind.Single;
          id: string;
      }
    | {
          kind: ParagraphKind.Range;
          start: string;
          end: string;
      };

export interface ParsedURL {
    // original URL
    fullPath: string;
    kind: ResourceKind;
    // path identifying the resource
    // ex> bofm/1-ne/5 or 2020/10/13whiting
    resourcePath: string;
    language: AvailableLanguage;
    // ex> 3,5-6,10 -> [{ kind: Single, id: "p3" }, { kind: Range, start: "p5", end: "p6"}, { kind: Single, id: "p10" }]
    paragraphs: Paragraph[];
}

// highly use-case specific to this plugin
export function parseURL(fullPath: string): ParsedURL {
    const url = new URL(fullPath);

    // matches against the url pathname
    const re = /\/study\/(scriptures|general-conference)\/(.*)/;
    const match = url.pathname.match(re);
    if (match === null) throw new Error(`Invalid URL ${fullPath}`);

    // regex has two groups. so if a match exists, it is guaranteed to have two groups.
    const kind =
        match[1] === "scriptures"
            ? ResourceKind.Scriptures
            : ResourceKind.ConferenceTalk;

    const resourcePath = match[2];
    const langBeforeCast = url.searchParams.get("lang") ?? "eng";
    const language = isAvailableLanguage(langBeforeCast)
        ? langBeforeCast
        : "eng";

    const id = url.searchParams.get("id");
    console.log(url.searchParams);
    console.log(JSON.stringify(url.searchParams));
    console.log({ fullPath, id });
    if (id === "" || id === null)
        throw new Error(
            `URL ${url} does not have an id query param. A specific paragraph within the page must be referenced through an id.`,
        );

    const paragraphs = id
        .split(",")
        .map((e) => e.split("-"))
        .map((ps) => {
            if (ps.length === 1)
                return { kind: ParagraphKind.Single as const, id: ps[0] };
            else if (ps.length === 2)
                return {
                    kind: ParagraphKind.Range as const,
                    start: ps[0],
                    end: ps[1],
                };
            else throw new Error(`${ps} is not a valid range`);
        });

    console.log({ paragraphs });

    return {
        fullPath,
        kind,
        resourcePath,
        language,
        paragraphs,
    };
}
