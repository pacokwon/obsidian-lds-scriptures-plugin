import { requestUrl } from 'obsidian'
import * as cheerio from 'cheerio';
import { parseURL } from './urlparsing';
import { ScriptureData } from '../types';
import { buildAPIURL,cheerioFind } from './apiutils';
import { PARAGRAPHS_IN_BODY_QUERY } from './config';


export async function fetchScripture(url:string, method: 'GET' | 'POST' | 'PATCH'): Promise<ScriptureData>{
    let book= "";
    let chapter = 0;
    let verses:Map<string,string> = new Map();

    let parsedData = parseURL(url);
    console.log(`parsed scripture URL: ${parsedData.pathParts}, ${parsedData.queryParams.id}, ${parsedData.paragraphs?.start}, ${parsedData.paragraphs?.end}`);
    let lang = parsedData.queryParams.lang ? parsedData.queryParams.lang : 'eng';

    if (parsedData.pathParts[1] !== "scriptures"){
        throw new Error('This can only refernce scripture verses.');
    }
    var apiurl = buildAPIURL(lang,url)
    console.log(`Scripture api ulr: ${apiurl}`)

    // request to API
    const response = await requestUrl({
        url:apiurl,
        method:method,
        headers:{}
    });

    if (response.status === 401 || response.status === 402) {
        console.log(response.status);
        return {      
            book,
            chapter,
            verses
        };
      }

try {
    const $ = cheerio.load(response.json["content"]["body"]);
    const [book, chapter] = response.json["meta"]["title"].split(" ");
    console.log(`Book: ${book}, Chapter: ${chapter}`);
    $(PARAGRAPHS_IN_BODY_QUERY.name).each((_, el) => {
        const id = $(el).attr('id');
        if (id) { // Only include elements that have an ID
            verses.set(id,$(el).text().trim());

        }
    });
    
    console.log(verses);


    // if (parsedData.paragraphs) {
    //     const { start, end } = parsedData.paragraphs;
    //     const paragraphEnd = end !== undefined ? end : start;
  
    //     for (let i = start; i <= paragraphEnd; i++) {
    //       const paragraph = $(`#p${i}`).text()?.trim();
    //       if (paragraph) {
    //         content.push(paragraph);
    //       } else {
    //         console.warn(`Paragraph #${i} not found.`);
    //       }
    //     }
    //   }

}

catch (error){
    console.error('Error occured: ', error)
}

    return {
        book,
        chapter,
        verses
    }
}
