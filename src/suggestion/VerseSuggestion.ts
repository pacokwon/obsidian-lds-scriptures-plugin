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
    private verseIds: string;
    private verses: Verse[];
    private url: string;

    constructor(
        public book: string,
        public chapter: number,
        public verseString: string,
        public verse: number[],
        public lang: AvailableLanguage,
    ) {
        this.verseIds = verseString
            .split(",")
            .map((range) =>
                range
                    .split("-")
                    .map((verse) => `p${verse}`)
                    .join("-"),
            )
            .join(",");
    }

    public getReplacement(): string {
        const range = this.formatNumberList(this.verse);
        const headerFront = `${this.bookTitleInLanguage}:`;
        const head = `> [!LDS] [${headerFront}${range}](${this.url})`;
        return head + "\n" + this.text + "\n";
    }

    private getUrl(): string {
        return `https://www.churchofjesuschrist.org/study/scriptures/${this.volumeTitleShort}/${this.bookTitleShort}/${this.chapter}?lang=${this.lang}&id=${this.verseIds}`;
    }

    private toText(): string {
        return this.verses
            .map(({ verse, text }) => `> ${verse} ${text}`)
            .join("\n");
    }

    private toPreviewText(): string {
        return this.verses
            .map(({ verse, text }) => `${verse}. ${text}`)
            .join("\n");
    }

    private getShortenedName(bookTitle: string) {
        for (const key in bookData) {
            if (bookData[key].names.includes(bookTitle)) {
                const volume = bookData[key].volume;
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

        const scriptureData = await fetchScripture(this.url);
        this.bookTitleInLanguage = scriptureData.nativeBookTitle;
        const verses = scriptureData.verses.map((_verse) => {
            const [_, verseNumber, text] = _verse.match(/^(\d+)\s*(.*)$/) ?? [
                null,
                "0",
                "",
            ];
            const verse = Number(verseNumber);

            return {
                volumeTitleShort: this.volumeTitleShort,
                bookTitleShort: this.bookTitleShort,
                chapter: this.chapter,
                verse,
                text,
            };
        });

        this.verses = verses;
        this.text = this.toText();
        this.previewText = this.toPreviewText();
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
