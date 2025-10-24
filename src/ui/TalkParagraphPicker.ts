import { App, Modal, requestUrl } from "obsidian";
import { AvailableLanguage } from "@/lang";
import { expandResourceUrl } from "@/utils/api";
import { findAuthor } from "@/utils/dom";
import { withSpinner } from "./spinner";

type Selection = {
    start: string;
    range: string;
    content: string[];
    author: { name: string; role: string };
};
export class TalkParagraphPicker extends Modal {
    // set of ids of paragraphs that are selected
    private selected: Set<string>;

    // list of paragraph ids to avoid re-querying in the merge algorithm
    private ids: string[];

    constructor(
        app: App,
        private resourcePath: string,
        private language: AvailableLanguage,
        private onPick: (result: Selection) => void,
    ) {
        super(app);
        this.selected = new Set();
    }

    // INFO: entrypoint to the modal
    async onOpen() {
        this.contentEl.addClass("conference-talk-modal");
        await this.populateParagraphElements();
    }

    async fetchTalkBody(): Promise<string> {
        const url = expandResourceUrl(this.resourcePath, this.language);
        const response = await withSpinner(this.contentEl, () =>
            requestUrl({ url, method: "GET" }),
        );
        return response.json.content.body;
    }

    async populateParagraphElements() {
        const body = await this.fetchTalkBody();

        // create template, manipulate dom and insert in the end
        const tpl = document.createElement("template");
        tpl.innerHTML = body;

        // remove footer
        tpl.content.querySelector("footer")?.remove();

        const div = this.makeButtonContainerDiv();

        // paragraphs (actually contains other elements like h1, etc)
        const ps = tpl.content.querySelectorAll("[data-aid]");
        this.ids = Array.from(ps).flatMap((e) => {
            // verbose function body due to type checking limitations if written otherwise
            const id = e.getAttribute("id");
            if (id !== null) return [id];
            else return [];
        });
        ps.forEach((el) => {
            el.addEventListener("click", (_) => {
                const id = el.getAttribute("id");

                if (id === null) return;

                if (this.selected.has(id)) {
                    this.selected.delete(id);
                    el.removeClass("selected");
                } else {
                    this.selected.add(id);
                    el.addClass("selected");
                }
            });
        });

        this.contentEl.append(tpl.content);
        this.modalEl.appendChild(div);
    }

    makeSelection(): Selection | null {
        const ranges: Array<[string, string]> = [];

        // iterate through ids, see if any consecutive ids are in the set
        for (let i = 0; i < this.ids.length; i++) {
            if (!this.selected.has(this.ids[i])) continue;

            let j = i + 1;
            while (j < this.ids.length && this.selected.has(this.ids[j])) {
                j++;
            }
            ranges.push([this.ids[i], this.ids[j - 1]]);

            i = j - 1;
        }

        if (ranges.length === 0) return null;

        const ids = Array.from(this.selected.entries())
            .map(([id, _]) => `#${id}`)
            .join(",");
        const idElements = this.contentEl.querySelectorAll(ids);
        const content = Array.from(idElements).flatMap((el) =>
            el.textContent !== null ? [el.textContent] : [],
        );
        const author = findAuthor(this.contentEl);

        return {
            start: ranges[0][0],
            range: ranges
                .map(([a, b]) => (a === b ? a : `${a}-${b}`))
                .join(","),
            content,
            author,
        };
    }

    makeButtonContainerDiv() {
        // div is the flexbox. it aligns the button to the right
        const div = document.createElement("div");
        div.className = "button-box";

        const button = document.createElement("button");
        button.className = "create-link mod-cta";
        button.textContent = "Insert Link";
        button.addEventListener("click", (_) => {
            const selection = this.makeSelection();

            if (selection === null) {
                this.close();
                return;
            }

            this.onPick(selection);
            this.close();
        });

        div.appendChild(button);

        return div;
    }

    onClose() {
        this.contentEl.empty();
        this.selected.clear();
    }
}
