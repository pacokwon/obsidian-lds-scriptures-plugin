

export interface Verse {
    volume_title: string;
    volume_title_short: string;
    book_title: string;
    book_title_short: string;
    chapter_number: number;
    verse_number: number;
    verse_title: string;
    scripture_text: string;
}

export interface Chapter {
    volume_title: string;
    volume_title_short: string;
    book_title: string;
    book_title_short: string;
    chapter_number: number;
    verses: Verse[];
}

export interface Book {
    volume_title: string;
    volume_title_short: string;
    book_title: string;
    book_title_short: string;
    chapters: Chapter[];
}

export interface GenConTalkData {
    title: string;
    author: string[];
    content: string[];
    year: string;
    month: string;
    setting: string;
  }

export interface ScriptureData{
    book:string;
    chapter:number;
    verses:Map<string,string>;

}

export interface BookInfo {
    volume: string;
    n_ch: number;
    names: string[];
  }
  
export interface BookData {
    [key: string]: BookInfo;
  }
