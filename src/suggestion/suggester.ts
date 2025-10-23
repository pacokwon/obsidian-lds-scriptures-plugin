import * as cheerio from "cheerio";
import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
    FuzzySuggestModal,
    requestUrl,
    SuggestModal,
    TFile,
} from "obsidian";
import LdsLibraryPlugin from "@/LdsLibraryPlugin";
import { AvailableLanguage } from "@/lang";
import { ConferenceMetadata } from "@/types";
import { BASE_URL, getConferenceTalkListUrl } from "@/utils/api";
import { ConferenceSuggestion } from "./ConferenceSuggestion";
import { VerseSuggestion } from "./VerseSuggestion";
import { TalkSuggestion, TalkSuggestModal } from "@/ui/TalkSuggestModal";
import { SingleSuggestion } from "./SingleSuggestion";
import { TalkParagraphPicker } from "@/ui/TalkParagraphPicker";
import { toCalloutString } from "@/utils/general-conference";

const FULL_VERSE_REG = /:([123]*[A-z ]{3,}) (\d{1,3}):(.*):/i;

export class VerseSuggester extends EditorSuggest<VerseSuggestion> {
    constructor(public plugin: LdsLibraryPlugin) {
        super(plugin.app);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _: TFile | null,
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(FULL_VERSE_REG)?.[0];

        if (!match) return null;

        return {
            start: {
                line: cursor.line,
                ch: currentContent.lastIndexOf(match),
            },
            end: cursor,
            query: match,
        };
    }

    async getSuggestions(
        context: EditorSuggestContext,
    ): Promise<VerseSuggestion[]> {
        const { language } = this.plugin.settings;
        const { query } = context;

        const fullMatch = query.match(FULL_VERSE_REG);

        if (fullMatch === null) return [];

        const book = fullMatch[1];
        const chapter = Number(fullMatch[2]);
        const verseString = fullMatch[3];

        const suggestion = new VerseSuggestion(
            book,
            chapter,
            verseString,
            language,
        );
        await suggestion.loadVerse();
        return [suggestion];
    }

    renderSuggestion(suggestion: VerseSuggestion, el: HTMLElement): void {
        suggestion.render(el);
    }

    selectSuggestion(
        suggestion: VerseSuggestion,
        _: MouseEvent | KeyboardEvent,
    ): void {
        if (!this.context) return;

        this.context.editor.replaceRange(
            suggestion.getReplacement(),
            this.context.start,
            this.context.end,
        );
    }

    expandRange(range: string): number[] {
        const [s, e] = range.split("-");

        let start = Number(s.trim());
        let end = Number(e.trim());

        const result = [];

        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    parseVerses(input: string): number[] {
        const items = input.split(",");
        let result: number[] = [];

        for (const item of items) {
            if (item.includes("-")) {
                result = result.concat(this.expandRange(item));
            } else {
                result.push(Number(item));
            }
        }
        const uniqueArray = Array.from(new Set(result));
        return uniqueArray;
    }
}

const CONF_REG = /:conf ([aA]pril|[oO]ctober) (\d{4}):/;
type ConferenceInfo = {
    year: number;
    month: 4 | 10;
};
type ConferencePromptSuggestion = SingleSuggestion<ConferenceInfo>;
export class ConferenceSuggester extends EditorSuggest<ConferencePromptSuggestion> {
    public app: App;

    constructor(public plugin: LdsLibraryPlugin) {
        super(plugin.app);
        this.app = plugin.app;
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _file: TFile | null,
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(CONF_REG)?.[0] ?? "";

        if (!match) return null;

        return {
            start: {
                line: cursor.line,
                ch: currentContent.lastIndexOf(match),
            },
            end: cursor,
            query: match,
        };
    }

    async getSuggestions(
        context: EditorSuggestContext,
    ): Promise<ConferencePromptSuggestion[]> {
        const { query } = context;
        const match = query.match(CONF_REG);
        if (match === null) return [];

        const month = match[1].toLowerCase() === "april" ? 4 : 10;
        const year = Number(match[2]);

        const suggestion = new SingleSuggestion<ConferenceInfo>(
            { year, month },
            "Open conference picker",
        );
        return [suggestion];
    }

    renderSuggestion(
        suggestion: ConferencePromptSuggestion,
        el: HTMLElement,
    ): void {
        suggestion.render(el);
    }

    async selectSuggestion(
        suggestion: ConferencePromptSuggestion,
        _evt: MouseEvent | KeyboardEvent,
    ): Promise<void> {
        if (!this.context) return;

        const { year, month } = suggestion.data;
        const language: AvailableLanguage = "eng";

        const url = getConferenceTalkListUrl(year, month, language);
        const response = await requestUrl({ url, method: "GET" });
        const $ = cheerio.load(response.json.content.body);

        const talks: TalkSuggestion[] = $(
            "nav > ul > li > ul > li[data-content-type='general-conference-talk'] > a",
        )
            .map((_, el) => {
                const title = $(el).find("p.title").text();
                const author = $(el).find("p.primaryMeta").text();
                const _href = $(el).attr("href") ?? "";
                const match = _href.match(/\/study(.*)\?.*/);
                if (match === null)
                    throw new Error(`${_href} is not a valid resource path`);
                const href = match[1];
                return { title, author, href };
            })
            .get();

        // pull it out before putting it in a different scope
        const { context } = this;
        new TalkSuggestModal(this.app, talks, ({ title, author, href }) => {
            new TalkParagraphPicker(
                this.app,
                href,
                language,
                ({ start, range, content, author }) => {
                    const url = `${BASE_URL}${href}?lang=${language}&id=${range}#${start}`;
                    const callout = toCalloutString({
                        url,
                        title,
                        author,
                        content,
                        year,
                        month,
                    });

                    context.editor.replaceRange(
                        callout,
                        context.start,
                        context.end,
                    );
                },
            ).open();
        }).open();
    }
}
