export interface Verse {
    volumeTitle: string;
    volumeTitleShort: string;
    bookTitle: string;
    bookTitleShort: string;
    chapterNumber: number;
    verseNumber: number;
    verseTitle: string;
    scriptureText: string;
}

export interface Chapter {
    volumeTitle: string;
    volumeTitleShort: string;
    bookTitle: string;
    bookTitleShort: string;
    chapterNumber: number;
    verses: Verse[];
}

export interface Book {
    volumeTitle: string;
    volumeTitleShort: string;
    bookTitle: string;
    bookTitleShort: string;
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

export interface ScriptureData {
    book: string;
    chapter: number;
    verses: Map<string, string>;
    inLanguageBook: string;
}

export interface BookInfo {
    volume: string;
    n_ch: number;
    names: string[];
}

export interface BookData {
    [key: string]: BookInfo;
}
