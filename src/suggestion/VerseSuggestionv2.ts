import * as fs from "fs/promises";

import { AvailableLanguage } from "../lang";
import { BookData, ScriptureData, Verse } from "../types";
import { book_data } from "src/utils/config";
import { fetchScripture } from "src/utils/scripture";
// import {App} from "obsidian"

export class VerseSuggestion {
    public text: string;
    public previewText: string;
    public chapter_data: ScriptureData[];
    private bookdata: BookData = book_data;
    private book_title_short: string;
    private volume_title_short: string;
    private verses: Verse[];
    private url: string;

    constructor(
        public pluginName: string,
        public book: string,
        public chapter: number,
        public verseStart: number,
        public verseEnd: number | null,
        public lang: AvailableLanguage,
        public linkType: "wiki" | "markdown",
        public createChapterLink: boolean,
    ) {}

    public getReplacement(): string {
        // const url = this.getUrl();
        let linktype = this.linkType;

        const range =
            this.verseEnd === null
                ? `${this.verseStart}`
                : `${this.verseStart}-${this.verseEnd}`;

        if (this.createChapterLink) {
            if (linktype == "wiki") {
                // Wiki style link to chapter document and outside URL
                const headerFront = `[[${this.book} ${this.chapter}|${this.book} ${this.chapter}:${range}]]`;
                const head = `> [!Mormon] ${headerFront} \n [churchofjesuschrist.org](${this.url})`;
                return head + "\n" + this.text + "\n";
            } else if (linktype == "markdown") {
                // Markdown style link with spaces encoded as %20
                const encodedBookChapter = encodeURIComponent(
                    `${this.book} ${this.chapter}`,
                );
                const headerFront = `[${this.book} ${this.chapter}:${range}](${encodedBookChapter})`;
                const head = `> [!Mormon] ${headerFront} \n [churchofjesuschrist.org](${this.url})`;
                return head + "\n" + this.text + "\n";
            }
        }

        // Normal function
        const headerFront = `${this.book} ${this.chapter}:`;
        const head = `> [!Mormon] [${headerFront}${range}](${this.url})`;
        return head + "\n" + this.text + "\n";
    }

    private getUrl(): string {
        const start = `p${this.verseStart}`;
        const range =
            this.verseEnd === null ? start : `${start}-p${this.verseEnd}`;

        return `https://www.churchofjesuschrist.org/study/scriptures/${this.volume_title_short}/${this.book_title_short}/${this.chapter}?lang=${this.lang}&id=${range}#${start}`;
    }

    private getVerses() {
        this.verses = [];
        let start = this.verseStart;
        let end = this.verseEnd ? this.verseEnd : this.verseStart;
        for (let i = start; i <= end; i++) {
            let verse_text = this.chapter_data[0].verses.get(`p${i}`);
            let verse: Verse = {
                volume_title: "", // Assuming you have these properties in your class
                volume_title_short: this.volume_title_short, // Assuming you have these properties in your class
                book_title: this.book, // Assuming you have these properties in your class
                book_title_short: this.book_title_short, // Assuming you have these properties in your class
                chapter_number: this.chapter, // Assuming you have these properties in your class
                verse_number: i,
                verse_title: "", // Set as needed
                scripture_text: verse_text
                    ? verse_text.trim().replace(/^\d{1,3}\s*/, "")
                    : "", // Handle possible undefined value
            };
            this.verses.push(verse);
        }
    }

    private toText(verses: Verse[]): string {
        return (
            `> <ol start="${verses[0].verse_number}">` +
            `${verses
                .map(({ scripture_text }) => `<li>${scripture_text}</li>`)
                .join(" ")}` +
            "</ol>"
        );
    }

    private toPreviewText(verses: Verse[]): string {
        return verses
            .map(
                ({ verse_number, scripture_text }) =>
                    `${verse_number}. ${scripture_text}`,
            )
            .join("\n");
    }

    private getShortenedName(bookTitle: string) {
        for (const key in this.bookdata) {
            if (this.bookdata[key].names.includes(bookTitle)) {
                let volume = this.bookdata[key].volume;
                return [key, volume];
            }
        }
        return [];
    }

    public async loadVerse(): Promise<void> {
        this.chapter_data = [];
        [this.book_title_short, this.volume_title_short] =
            this.getShortenedName(this.book);
        this.url = this.getUrl();
        console.log(`Scripture URL: ${this.url}`);
        let scriptdata: ScriptureData = await fetchScripture(this.url, "GET");
        this.chapter_data.push(scriptdata);
        this.getVerses();
        this.text = this.toText(this.verses);
        this.previewText = this.toPreviewText(this.verses);
    }

    public render(el: HTMLElement): void {
        const outer = el.createDiv({ cls: "obr-suggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.previewText);
    }
}
