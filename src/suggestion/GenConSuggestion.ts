import { format, parse } from "date-fns";
import { GenConTalkData } from "src/types";
import { fetchGenConTalk } from "src/utils/generalconference";

export class GenConSuggestion {
    public text: string;
    public previewText: string; //this is what's loaded by the preview thing.
    public content: GenConTalkData; //should this be an array of item? probably not.
    public date: string;

    constructor(
        public pluginName: string,
        public url: string,
        public linkType: "wiki" | "markdown",
    ) {}

    private async getParagraphs(): Promise<GenConTalkData> {
        return await fetchGenConTalk(this.url, "GET");
    }

    private convertDate = (dateString: string): string => {
        // Parse the date string
        const parsedDate = parse(dateString, "MM-yyyy", new Date());
        // Format the parsed date to the desired format
        return format(parsedDate, "MMMM yyyy");
    };

    public getReplacement(): string {
        this.text = this.toText();
        let headerFront = `>[!gencon] [${this.content.title}](${this.url})`;
        const attribution = `>> [!genconcitation]\n>> ${this.content.author[0]}\n>> ${this.content.author[1]}\n>>${this.date}`;
        return headerFront + "\n" + this.text + attribution + "\n";
    }

    private toPreviewText(talkData: GenConTalkData): string {
        let text = `${talkData.title} ${talkData.author[0]}`;
        return text;
    }

    private toText(): string {
        let outstring = "";

        this.content.content.forEach((element) => {
            outstring = outstring + `> ${element}\n>\n `;
        });

        return outstring;
    }

    public async loadTalk(): Promise<void> {
        this.content = await this.getParagraphs();
        this.previewText = this.toPreviewText(this.content);
        this.date = this.convertDate(
            `${this.content.month}-${this.content.year}`,
        );
    }

    public render(el: HTMLElement): void {
        //run by the program, note i've defined it to use preview text...
        const outer = el.createDiv({ cls: "obr-sugggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.previewText);
    }
}
