import { AvailableLanguage } from "../lang";
import { BookData, ScriptureData, Verse } from "../types";
import { book_data } from "src/utils/config";
import { fetchScripture } from "src/utils/scripture";
// import {App} from "obsidian"

export class VerseSuggestion {
    // defining variables in the class.
    public text: string;
    public previewText: string;
    public chapter_data: ScriptureData[];
    private bookdata: BookData = book_data;
    private book_title_short: string;
    private volume_title_short: string;
    private verses: Verse[];
    private url: string;

    constructor(
        //input variables.
        public pluginName: string,
        public book: string,
        public chapter: number,
        public vers: number[],
        public lang: AvailableLanguage,
        public linkType: "wiki" | "markdown",
        public createChapterLink: boolean,
    ) {}

    public getReplacement(): string {
        // const url = this.getUrl();
        let linktype = this.linkType;
        let range = this.formatNumberList(this.vers)

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
        return `https://www.churchofjesuschrist.org/study/scriptures/${this.volume_title_short}/${this.book_title_short}/${this.chapter}?lang=${this.lang}`;
    }

    private getVerses() {
        this.verses = [];

        for (const index in this.vers) {
            let verse_text = this.chapter_data[0].verses.get(`p${this.vers[index]}`);
            let verse: Verse = {
                volume_title: "", // Assuming you have these properties in your class
                volume_title_short: this.volume_title_short, // Assuming you have these properties in your class
                book_title: this.book, // Assuming you have these properties in your class
                book_title_short: this.book_title_short, // Assuming you have these properties in your class
                chapter_number: this.chapter, // Assuming you have these properties in your class
                verse_number: this.vers[index],
                verse_title: "", // Set as needed
                scripture_text: verse_text
                    ? verse_text.trim().replace(/^\d{1,3}\s*/, "")
                    : "", // Handle possible undefined value
            };
            this.verses.push(verse);
        }
    }

    private toText(verses: Verse[]): string {
        return verses
        .map(
            ({ verse_number, scripture_text }) =>
                `> ${verse_number} ${scripture_text}`,
        )
        .join("\n");
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
    public formatNumberList(numbers: number[]): string {
        if (numbers.length === 0) return "";
    
        // Ensure the numbers are sorted
        numbers.sort((a, b) => a - b);
    
        const result: string[] = [];
        let rangeStart = numbers[0];
        let rangeEnd = numbers[0];
    
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] === rangeEnd + 1) {
                // Continue the range
                rangeEnd = numbers[i];
            } else {
                // End the current range and start a new one
                if (rangeStart === rangeEnd) {
                    result.push(rangeStart.toString());
                } else {
                    result.push(`${rangeStart}-${rangeEnd}`);
                }
                rangeStart = numbers[i];
                rangeEnd = numbers[i];
            }
        }
    
        // Add the last range
        if (rangeStart === rangeEnd) {
            result.push(rangeStart.toString());
        } else {
            result.push(`${rangeStart}-${rangeEnd}`);
        }
    
        return result.join(", ");
    }

    
}
