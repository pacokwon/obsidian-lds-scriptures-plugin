interface ParsedURL {
    protocol: string;
    hostname: string;
    pathParts: string[];
    queryParams: {
        lang?: string;
        id?: string;
    };
    paragraphs?: {
        start: number;
        end: number;
    };
}

export function parseURL(url: string): ParsedURL {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/").filter((part) => part);

    const searchParams = new URLSearchParams(parsedUrl.search);
    const queryParams: { [key: string]: string | undefined } = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    let paragraphs;
    const id = queryParams.id;
    if (typeof id === "string") {
        let match = id.match(/p(\d+)-p(\d+)/);
        if (match) {
            paragraphs = {
                start: parseInt(match[1], 10),
                end: parseInt(match[2], 10),
            };
        } else {
            match = id.match(/p(\d+)/);
            if (match) {
                paragraphs = {
                    start: parseInt(match[1], 10),
                    end: parseInt(match[1], 10),
                };
            }
        }
    }

    return {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        pathParts,
        queryParams: {
            lang: queryParams.lang,
            id: queryParams.id,
        },
        paragraphs,
    };
}
