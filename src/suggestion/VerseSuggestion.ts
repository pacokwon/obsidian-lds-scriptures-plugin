import * as fs from "fs/promises";
import { AvailableLanguage } from "../lang";
import { getScripturesPath } from "../metadata";
import { Book, Verse } from "../types";

export class VerseSuggestion {
    public text: string;
    public previewText: string;
    public verses: Verse[][];

    constructor(
        public pluginName: string,
        public book: string,
        public chapter: number,
		public ranges: { start: number; end: number | null }[],
        public lang: AvailableLanguage
    ) {}

    public getReplacement(): string {
        const url = this.getUrl();
        const headerFront = `${this.book} ${this.chapter}:`;
        const range = this.ranges.map(({ start, end }) => {
            return end === null ? `${start}` : `${start}-${end}`;
        }).join(', ');

        const head = `> [!Mormon] [${headerFront}${range}](${url})`;
        return head + "\n" + this.text + "\n";
    }

    private getUrl(): string {
        /* The church's url only supports one reference, so just use the first one */
        const { volume_title_short, book_title_short, chapter_number } = this.verses[0][0];
        const { lang } = this;

        const verseStart = this.ranges[0].start;
        const verseEnd = this.ranges[0].end;

        const start = `p${verseStart}`;
        const range = verseEnd === null ? start : `${start}-p${verseEnd}`;

        return `https://www.churchofjesuschrist.org/study/scriptures/${volume_title_short}/${book_title_short}/${chapter_number}?lang=${lang}&id=${range}#${start}`;
    }

    private async fetchVerses(): Promise<Verse[][]> {
        const fileContent = await fs.readFile(
            `${getScripturesPath(this.pluginName, this.lang)}/${this.book}.json`
        );
        const book: Book = JSON.parse(fileContent.toString());
        const chapter = book.chapters[this.chapter - 1];

        return this.ranges.map(({ start, end }) => {
            if (end === null) {
                return [chapter.verses[start - 1]];
            }

            return chapter.verses.slice(start - 1, end);
        });
    }

    private toText(versesArr: Verse[][]): string {
        const lists = versesArr.map(verses => {
            return (
                `> <ol start="${verses[0].verse_number}">` +
				`${verses.map(({ scripture_text }) => `<li>${scripture_text}</li>`).join(" ")}` +
				'</ol>'
            );
        })

        return lists.join("\n > <hr />\n");
    }

    private toPreviewText(versesArr: Verse[][]): string {
        return versesArr.flatMap(verses => {
            return verses.map(({ verse_number, scripture_text }) => `${verse_number}. ${scripture_text}`);
        }).join('\n');
    }

    public async loadVerse(): Promise<void> {
        const verses = await this.fetchVerses();
        this.verses = verses;
        this.text = this.toText(verses);
        this.previewText = this.toPreviewText(verses);
    }

    public render(el: HTMLElement): void {
        const outer = el.createDiv({ cls: "obr-suggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.previewText);
    }
}
