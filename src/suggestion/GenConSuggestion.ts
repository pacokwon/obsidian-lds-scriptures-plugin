import { link } from "fs";
import { GenConTalkData } from "src/types";
import { fetchGenConTalk } from "src/utils/generalconference";

export class GenConSuggestion {
    public text: string;
    public previewText: string;//this is what's loaded by the preview thing.
    public content: GenConTalkData; //should this be an array of item? probably not.

    constructor(
        public pluginName: string,
        public url: string,
        public linkType: "wiki" | "markdown"
    ) {}

    private async getParagraphs(): Promise<GenConTalkData> {
        return await(fetchGenConTalk(this.url, "GET"));

    }

    public getReplacement(): string {
        let linktype = this.linkType;
        this.text = this.toText();
        let headerFront = `>[!gencon] [${this.content.title}](${this.url})`;

        const attribution = (`>> [!genconcitation]\n>> ${this.content.author[0]}\n>> ${this.content.author[1]}`)
        
        return headerFront + "\n" + this.text + attribution + "\n"
    }

    private toPreviewText(talkData: GenConTalkData):string{
        // this.previewText = talkData.title + "\n\n" +
        //      talkData.content[0]      

        let text = `${talkData.title} ${talkData.author[0]}`
        return text
    }

    private toText():string {
        let outstring:string = "";
        
        this.content.content.forEach((element) =>{
            outstring = outstring + `> ${element} \n>\n `;

        }
        )
        return outstring
    }

    public async loadTalk(): Promise<void> {

        this.content = await(this.getParagraphs());
        this.previewText = this.toPreviewText(this.content);
    }

    public render(el: HTMLElement): void { //run by the program, note i've defined it to use preview text...
        const outer = el.createDiv({cls: 'obr-sugggester-container'});
        outer.createDiv({cls: "obr-shortcode"}).setText(this.previewText)
    }
}
