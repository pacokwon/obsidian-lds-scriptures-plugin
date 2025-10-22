import { AvailableLanguage } from "./lang";

export interface Verse {
    volumeTitleShort: string;
    bookTitleShort: string;
    chapter: number;
    verse: number;
    text: string;
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

export interface Author {
    name: string;
    role: string;
}

export interface ConferenceTalkData {
    title: string;
    author: Author;
    content: string[];
    year: string;
    month: string;
    setting: string;
}

export interface ConferenceMetadata {
    year: number;
    month: 4 | 10;
    language: AvailableLanguage;
}

export interface ScriptureData {
    book: string;
    chapter: number;
    verses: string[];
    nativeBookTitle: string;
}

export interface BookInfo {
    volume: string;
    n_ch: number;
    names: string[];
}

export interface BookData {
    [key: string]: BookInfo;
}
