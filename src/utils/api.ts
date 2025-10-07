// Some of the following code is adapted from @epeters3 in his repository https://github.com/epeters3/gospel-search

type Query = {
    name: string;
} & ({ class: string } | { id: string });

export function cheerioFind(
    $: cheerio.Root,
    queries: Query[],
): cheerio.Cheerio | null {
    for (const query of queries) {
        const elements = $(query.name).filter((_, el) =>
            Object.entries(query).every(
                ([key, value]) => key === "name" || $(el).attr(key) === value,
            ),
        );
        if (elements.length > 0) {
            return elements.first();
        }
    }
    return null;
}

export function extractURLPath(url: string): string | null {
    const genconregex =
        /https:\/\/www\.churchofjesuschrist\.org\/study(\/[\w-]+\/\d{4}\/\d{2}\/[\w-]+)/;
    const scriptureregex =
        /https:\/\/www\.churchofjesuschrist\.org\/study(\/[\w-]+\/[\w-]+\/[\w-]+\/[\w-]+)/;

    const match = url.match(genconregex)
        ? url.match(genconregex)
        : url.match(scriptureregex)
          ? url.match(scriptureregex)
          : null;

    return match ? match[1] : null;
}

export function buildAPIURL(lang: string, url: string) {
    const path = extractURLPath(url);

    return (
        `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${lang}&uri=` +
        path
    );
}
