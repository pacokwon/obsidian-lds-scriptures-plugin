
import { requestUrl } from 'obsidian'
import * as cheerio from 'cheerio';
import { parseURL } from './urlparsing';
import { GenConTalkData } from '../types';
import {NAME_QUERIES, AUTHOR_QUERIES, AUTHOR_TITLE, PARAGRAPHS_IN_BODY_QUERY} from './config';
import { buildAPIURL,cheerioFind } from './apiutils';


export async function fetchGenConTalk(url:string,method: 'GET' | 'POST' | 'PATCH'): Promise<GenConTalkData>{
    let title =  "";
    let author:string[] = [];
    let content:string[] =[];
    let year = "";
    let month = "";
    let setting = "";
    let parsedData = parseURL(url);
    let lang = parsedData.queryParams.lang ? parsedData.queryParams.lang : 'eng';

    if (parsedData.pathParts[1] !== "general-conference"){
        throw new Error('This can only refernce talks from General Conference.');
    }

    var talkurl = buildAPIURL(lang,url)

    console.log(`Parsed Data from URL: `, parsedData);
    console.log(`Starting AXIOS request of ${talkurl}`)
    // const response = await axios.get(talkurl);

    const response = await requestUrl({
        url: talkurl,
        method: method,
        headers:{
        }
    });
    if (response.status === 401 || response.status === 402) {
        console.log(response.status);
        return {      
          title,
          author,
          content,
          year,
          month,
          setting};
      }
  
    try {
        const $ = cheerio.load(response.json["content"]["body"]);
        const nameElement = cheerioFind($, NAME_QUERIES);
        title = nameElement ? nameElement.text().trim() : "Title not found";
    
        const authorElement = cheerioFind($, AUTHOR_QUERIES);
        let authorname = authorElement ? authorElement.text().trim().replace(/^[B|b]y\s/, "") : "Author not found";
        const authorRoleElement = cheerioFind($, AUTHOR_TITLE);
        let authorrole = authorRoleElement ? authorRoleElement.text().trim() : "Author role not found";
        author.push(authorname);
        author.push(authorrole);
        console.log(`Athor array: ${author}`)
        // let body = $(PARAGRAPHS_IN_BODY_QUERY.name).map((_, el) => $(el).text().trim()).get();
        // console.log(`Body?: ${body}`)

        // if (parsedData.paragraphs){
        //   const {start,end} = parsedData.paragraphs;
        //   const paragraphEnd = end !== undefined ? end : start;
        //   content = body.slice(start-1, end);
        // }


        // title = $('#title1').text().trim();
        
        // if (title.length === 0){
        //   title = $('h1').first().text().trim();
            
          
        //   // title = $('#p1').text().trim();
        // }
        // // author = [$('#author1').text().trim(), $('#author2').text().trim()].filter(Boolean);
        // // author = [$('#author-name').text().trim(), $('#author-role').text().trim()].filter(Boolean);
        // author = [$('.author-name').text().trim(), $('.author-role').text().trim()].filter(Boolean);
        
        // if (author.length === 0) {
        //   let author = [$('#author1').text().trim(), $('#author2').text().trim()].filter(Boolean);
        // }
        if (parsedData.paragraphs) {
            const { start, end } = parsedData.paragraphs;
            const paragraphEnd = end !== undefined ? end : start;
      
            for (let i = start; i <= paragraphEnd; i++) {
              const paragraph = $(`#p${i}`).text()?.trim();
              if (paragraph) {
                content.push(paragraph);
              } else {
                console.warn(`Paragraph #${i} not found.`);
              }
            }
          }

        year = parsedData.pathParts[2];
        month = parsedData.pathParts[3];
        setting = "General Conference";

        console.log( 
            title,
            author,
            content,
            year,
            month,
            setting
        )
  
        if (!title || !content) {
          console.log(`title error: ${title}`);
          console.log(`content error: ${content}`);
          throw new Error('Unable to extract the necessary data from the webpage.');
        }

      } catch (error) {


        console.error('Error fetching or parsing data:', error);

      }
      return {
        title,
        author,
        content,
        year,
        month,
        setting
      };
    }

