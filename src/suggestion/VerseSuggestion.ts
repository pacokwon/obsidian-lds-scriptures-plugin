import { AvailableLanguage } from "@/lang";
import { ScriptureData, Verse } from "@/types";
import { bookData } from "@/utils/config";
import { fetchScripture } from "@/utils/scripture";

export class VerseSuggestion {
    // defining variables in the class.
    public text: string;
    public previewText: string;
    public chapterData: ScriptureData[];
    private bookTitleShort: string;
    private bookTitleInLanguage: string;
    private volumeTitleShort: string;
    private verses: Verse[];
    private url: string;

    constructor(
        public book: string,
        public chapter: number,
        public verse: number[],
        public lang: AvailableLanguage,
        public linkType: "wiki" | "markdown",
        public createChapterLink: boolean,
    ) {}

    public getReplacement(): string {
        const linkType = this.linkType;
        const range = this.formatNumberList(this.verse);

        if (this.createChapterLink) {
            if (linkType === "wiki") {
                console.log("wIKI!");
                // Wiki style link to chapter document and outside URL
                const headerFront = `[[${this.bookTitleInLanguage}|${this.bookTitleInLanguage}:${range}]]`;
                const head = `> [!LDS] ${headerFront} \n [churchofjesuschrist.org](${this.url})`;
                return head + "\n" + this.text + "\n";
            } else if (linkType === "markdown") {
                // Markdown style link with spaces encoded as %20
                const encodedBookChapter = encodeURIComponent(
                    `${this.bookTitleInLanguage}`,
                );
                const headerFront = `[${this.bookTitleInLanguage}:${range}](${encodedBookChapter})`;
                const head = `> [!LDS] ${headerFront} \n [churchofjesuschrist.org](${this.url})`;
                return head + "\n" + this.text + "\n";
            }
        }

        // Normal function
        const headerFront = `${this.bookTitleInLanguage}:`;
        const head = `> [!LDS] [${headerFront}${range}](${this.url})`;
        return head + "\n" + this.text + "\n";
    }

    private getUrl(): string {
        return `https://www.churchofjesuschrist.org/study/scriptures/${this.volumeTitleShort}/${this.bookTitleShort}/${this.chapter}?lang=${this.lang}`;
    }

    private getVerses() {
        this.verses = [];

        for (const index in this.verse) {
            let verseText = this.chapterData[0].verses.get(
                `p${this.verse[index]}`,
            );
            let verse: Verse = {
                volumeTitle: "", // Assuming you have these properties in your class
                volumeTitleShort: this.volumeTitleShort, // Assuming you have these properties in your class
                bookTitle: this.book, // Assuming you have these properties in your class
                bookTitleShort: this.bookTitleShort, // Assuming you have these properties in your class
                chapterNumber: this.chapter, // Assuming you have these properties in your class
                verseNumber: this.verse[index],
                verseTitle: "", // Set as needed
                scriptureText: verseText
                    ? verseText.trim().replace(/^\d{1,3}\s*/, "")
                    : "", // Handle possible undefined value
            };
            this.verses.push(verse);
        }
    }

    private toText(verses: Verse[]): string {
        return verses
            .map(
                ({ verseNumber, scriptureText }) =>
                    `> ${verseNumber} ${scriptureText}`,
            )
            .join("\n");
    }

    private toPreviewText(verses: Verse[]): string {
        return verses
            .map(
                ({ verseNumber, scriptureText }) =>
                    `${verseNumber}. ${scriptureText}`,
            )
            .join("\n");
    }

    private getShortenedName(bookTitle: string) {
        for (const key in bookData) {
            if (bookData[key].names.includes(bookTitle)) {
                let volume = bookData[key].volume;
                return [key, volume];
            }
        }
        return [];
    }

    public async loadVerse(): Promise<void> {
        this.chapterData = [];
        [this.bookTitleShort, this.volumeTitleShort] = this.getShortenedName(
            this.book,
        );
        this.url = this.getUrl();

        let scriptureData: ScriptureData = await fetchScripture(
            this.url,
            "GET",
        );
        this.bookTitleInLanguage = scriptureData.inLanguageBook;
        this.chapterData.push(scriptureData);
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
