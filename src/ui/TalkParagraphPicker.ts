import { App, Modal, requestUrl } from "obsidian";
import { AvailableLanguage } from "@/lang";
import { expandResourceUrl } from "@/utils/api";

export class TalkParagraphPicker extends Modal {
    constructor(
        app: App,
        private resourcePath: string,
        private language: AvailableLanguage,
        private onPick: (result: string) => void,
    ) {
        super(app);
    }

    async onOpen() {
        this.contentEl.addClass("conference-talk-modal");
        await this.populateParagraphElements();
    }

    async fetchTalkBody(): Promise<string> {
        const url = expandResourceUrl(this.resourcePath, this.language);
        const response = await requestUrl({ url, method: "GET" });
        return response.json.content.body;
    }

    async populateParagraphElements() {
        const body = await this.fetchTalkBody();

        // create template, manipulate dom and insert in the end
        const tpl = document.createElement("template");
        tpl.innerHTML = body;

        // remove footer
        tpl.content.querySelector("footer")?.remove();

        // const selected = new Set();
        // // paragraphs (actually contains other elements like h1, etc)
        // const ps = tpl.content.querySelectorAll("[data-aid]");
        // ps.forEach((el) => {
        //     el.addEventListener("click", (_) => {
        //         selected.add(el.getAttribute("id"));
        //     });
        // });

        this.contentEl.append(tpl.content);
    }

    onClose() {
        this.contentEl.empty();
    }
}
