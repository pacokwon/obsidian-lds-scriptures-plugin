import axios from 'axios';
import * as cheerio from 'cheerio';


// this code is adapted from @epeters3 in his repository https://github.com/epeters3/gospel-search
const NAME_QUERIES = [
    { name: 'h1', id: 'title1' },
    { name: 'h1', id: 'p1' },
    { name: 'h1', id: 'p4' },
    { name: 'h1', id: 'title56' }
];

const AUTHOR_QUERIES = [
    { name: 'p', id: 'author1' },
    { name: 'p', id: 'p1' },
    { name: 'p', class: 'author-name' }
];

const PARAGRAPHS_IN_BODY_QUERY = { name: 'p' };

let title: string = "";
let author: string[] = [];
let paragraphs: string[] = [];

function cheerioFind($: cheerio.Root, queries: any[]): cheerio.Cheerio | null {
    for (const query of queries) {
        const elements = $(query.name).filter((_, el) => {
            return Object.keys(query).every(key => key === 'name' || $(el).attr(key) === query[key]);
        });
        if (elements.length > 0) {
            return elements.first();
        }
    }
    return null;
}

function extractAuthor(text: string): string {
    // Use a regular expression to replace "By " or "by " at the start of the string
    return text.replace(/^[B|b]y\s/, "");
}

async function main(url: string) {
    const response = await axios.get(url);
    console.log(response.data);

    const html = response.data["content"]["body"];
    const $ = cheerio.load(html);

    const nameElement = cheerioFind($, NAME_QUERIES);
    title = nameElement ? nameElement.text().trim() : "Title not found";

    const authorElement = cheerioFind($, AUTHOR_QUERIES);
    author = authorElement ? [authorElement.text().trim().replace(/^[B|b]y\s/, "")] : ["Author not found"];

    paragraphs = $(PARAGRAPHS_IN_BODY_QUERY.name).map((_, el) => $(el).text().trim()).get();

    console.log("Title:", title);
    console.log("Author:", author);
    console.log("Paragraphs:", paragraphs);
}

function extractPath(url: string): string | null {
    const regex = /https:\/\/www\.churchofjesuschrist\.org\/study(\/general-conference\/\d{4}\/\d{2}\/\w+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

if (require.main === module) {
    let path = extractPath('https://www.churchofjesuschrist.org/study/general-conference/2024/04/17gerard?lang=eng&id=p1-p2#p1')
    // console.log(path)

    let url = "https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=eng&uri=" + path;
    main(url);
}
