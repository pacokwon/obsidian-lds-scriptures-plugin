import { format, parse } from "date-fns";
import { ConferenceTalkData } from "@/types";
import { fetchConferenceTalk } from "@/utils/general-conference";

export class ConferenceSuggestion {
    public text: string;
    public previewText: string; //this is what's loaded by the preview thing.
    public talkData: ConferenceTalkData; //should this be an array of item? probably not.
    public date: string;

    constructor(public url: string) {}

    private convertDate = (dateString: string): string => {
        // Parse the date string
        const parsedDate = parse(dateString, "MM-yyyy", new Date());
        // Format the parsed date to the desired format
        return format(parsedDate, "MMMM yyyy");
    };

    public getReplacement(): string {
        this.text = this.toText();
        let headerFront = `>[!gencon] [${this.talkData.title}](${this.url})`;
        const attribution = `>> [!genconcitation]\n>> ${this.talkData.author.name}\n>> ${this.talkData.author.role}\n>>${this.date}`;
        return headerFront + "\n" + this.text + attribution + "\n";
    }

    private toPreviewText(): string {
        let text = `${this.talkData.title} ${this.talkData.author.name}`;
        return text;
    }

    private toText(): string {
        let outstring = "";

        this.talkData.content.forEach((element) => {
            outstring = outstring + `> ${element}\n>\n`;
        });

        return outstring;
    }

    public async loadTalk(): Promise<void> {
        this.talkData = await fetchConferenceTalk(this.url);
        this.previewText = this.toPreviewText();
        this.date = this.convertDate(
            `${this.talkData.month}-${this.talkData.year}`,
        );
    }

    public render(el: HTMLElement): void {
        //run by the program, note i've defined it to use preview text...
        const outer = el.createDiv({ cls: "obr-sugggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.previewText);
    }
}
