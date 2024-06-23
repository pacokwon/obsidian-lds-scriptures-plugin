// import axios from 'axios';
// import cheerio from 'cheerio';
// import fs from 'fs';
import { requestUrl } from 'obsidian'
import * as cheerio from 'cheerio';
import { parseURL } from './urlparsing';
import { GenConTalkData } from 'src/types';



export async function fetchGenConTalk(url:string,method: 'GET' | 'POST' | 'PATCH'): Promise<GenConTalkData>{
    let title =  "";
    let author:string[] = [];
    let content:string[] =[];
    let year = "";
    let month = "";
    let setting = "";
    let parsedData = parseURL(url);

    if (parsedData.pathParts[1] !== "general-conference"){
        throw new Error('This can only refernce talks from General Conference.');
    }

    console.log(parsedData);

    const response = await requestUrl({
        url: url,
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
        const $ = cheerio.load(response.text);
        title = $('h1').first().text().trim();
        if (title.length === 0){
            title = $('#title1').text().trim();
          
          // title = $('#p1').text().trim();
        }
        // author = [$('#author1').text().trim(), $('#author2').text().trim()].filter(Boolean);
        // author = [$('#author-name').text().trim(), $('#author-role').text().trim()].filter(Boolean);
        author = [$('.author-name').text().trim(), $('.author-role').text().trim()].filter(Boolean);
        
        if (author.length === 0) {
          let author = [$('#author1').text().trim(), $('#author2').text().trim()].filter(Boolean);
        }
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