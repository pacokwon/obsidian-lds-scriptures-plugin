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
