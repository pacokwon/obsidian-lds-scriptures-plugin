import { AvailableLanguage } from "@/lang";
import { bookData } from "@/utils/config";
import { fetchScripture } from "@/utils/scripture";

export class VerseSuggestion {
    // defining variables in the class.
    public text: string;
    private bookTitleInLanguage: string;
    private verseIds: string;
    private url: string;

    constructor(
        public book: string,
        public chapter: number,
        public verseString: string,
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
        const range = this.verseString.replaceAll(",", ", ");
        const headerFront = `${this.bookTitleInLanguage}:`;
        const head = `> [!ldslib] [${headerFront}${range}](${this.url})`;
        return head + "\n" + this.text + "\n";
    }

    private getUrl(volumeTitleShort: string, bookTitleShort: string): string {
        return `https://www.churchofjesuschrist.org/study/scriptures/${volumeTitleShort}/${bookTitleShort}/${this.chapter}?lang=${this.lang}&id=${this.verseIds}`;
    }

    private getShortenedName(bookTitle: string) {
        for (const [name, info] of Object.entries(bookData)) {
            if (
                info.names.some(
                    (name) => name.toLowerCase() === bookTitle.toLowerCase(),
                )
            ) {
                const volume = info.volume;
                return [name, volume];
            }
        }
        return ["", ""];
    }

    public async loadVerse(): Promise<void> {
        const [bookTitleShort, volumeTitleShort] = this.getShortenedName(
            this.book,
        );

        if (bookTitleShort === "" || volumeTitleShort === "")
            throw new Error(`Couldn't find book name ${this.book}`);

        this.url = this.getUrl(volumeTitleShort, bookTitleShort);

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
                volumeTitleShort,
                bookTitleShort,
                chapter: this.chapter,
                verse,
                text,
            };
        });

        this.text = verses
            .map(({ verse, text }) => `> ${verse} ${text}`)
            .join("\n");
    }

    public render(el: HTMLElement): void {
        const outer = el.createDiv({ cls: "obr-suggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.text);
    }
}
