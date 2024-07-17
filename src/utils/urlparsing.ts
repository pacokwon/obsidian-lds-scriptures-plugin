import { URL } from 'url';
import queryString from 'query-string';

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
    const pathParts = parsedUrl.pathname.split('/').filter(part => part);

    const queryParams = queryString.parse(parsedUrl.search);
    
    let paragraphs;
    const id = queryParams.id;
    if (typeof id === 'string') {
        let match = id.match(/p(\d+)-p(\d+)/);
        if (match) {
        paragraphs = {
            start: parseInt(match[1], 10),
            end: parseInt(match[2], 10)
        };
        } else {
        match = id.match(/p(\d+)/);
        if (match) {
            paragraphs = {
            start: parseInt(match[1], 10),
            end: parseInt(match[1], 10)
            };
        }
        }
        }
    

    return {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        pathParts,
        queryParams: {
        lang: queryParams.lang as string,
        id: id as string
        },
        paragraphs
    };
}