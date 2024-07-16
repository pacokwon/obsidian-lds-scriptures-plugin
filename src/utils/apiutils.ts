// Some of the following code is adapted from @epeters3 in his repository https://github.com/epeters3/gospel-search



export function cheerioFind($: cheerio.Root, queries: any[]): cheerio.Cheerio | null {
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
  
  export function extractURLPath(url: string): string | null {
    const genconregex = /https:\/\/www\.churchofjesuschrist\.org\/study(\/[\w-]+\/\d{4}\/\d{2}\/[\w-]+)/;
    const scriptureregex = /https:\/\/www\.churchofjesuschrist\.org\/study(\/[\w-]+\/[\w-]+\/[\w-]+\/[\w-]+)/;
    const match = url.match(genconregex) ? url.match(genconregex): url.match(scriptureregex)?url.match(scriptureregex):null ;
    // console.log(`REGEX MATCH: ${match}`)
    return match ? match[1] : null;
  }

//   export function extractGenConURLPath(url: string): string | null {
//     const regex = /https:\/\/www\.churchofjesuschrist\.org\/study(\/general-conference\/\d{4}\/\d{2}\/[\w-]+)/;
//     const match = url.match(regex);
//     console.log(`REGEX MATCH: ${match}`)
//     return match ? match[1] : null;
//   }
  
  export function buildAPIURL(lang:string,url:string){
    let path = extractURLPath(url)
    // console.log(`Path extracted: ${path}`)
    return `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${lang}&uri=` + path;
  }

  