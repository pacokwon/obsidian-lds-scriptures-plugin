import * as fs from "fs/promises";
import { PLUGIN_BASE_PATH } from "src/metadata";
import { Book, Verse } from "src/types";

export class VerseSuggestion {
    public text: string;

    constructor(
        public book: string,
        public chapter: number,
        public verseStart: number,
        public verseEnd: number | null
    ) {}

    public getReplacement(): string {
        const head = `> [!Mormon] ${this.book} ${this.chapter}:`;
        const range = this.verseEnd === null ? `${this.verseStart}` : `${this.verseStart}-${this.verseEnd}`;
        return head + range + '\n' + this.text + '\n';
    }

    private async fetchVerses(): Promise<Verse[]> {
        const fileContent = await fs.readFile(
            `${PLUGIN_BASE_PATH}/scriptures/${this.book}.json`
        );
        const book: Book = JSON.parse(fileContent.toString());

        const chapter = book.chapters[this.chapter];
        if (this.verseEnd === null)
            return [chapter.verses[this.verseStart - 1]];

        return chapter.verses.slice(this.verseStart - 1, this.verseEnd);
    }

    private toText(verses: Verse[]): string {
        return verses.map(
            ({ verse_number, scripture_text }) =>
                `> ${verse_number}. ${scripture_text}`
        ).join('\n');
    }

    public async loadVerse(): Promise<void> {
        const verses = await this.fetchVerses();
        this.text = this.toText(verses);
    }

    public render(el: HTMLElement): void {
        const outer = el.createDiv({ cls: "obr-suggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.text);
    }
}
