import {
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
    TFile,
} from "obsidian";
import BookOfMormonPlugin from "src/main";
import { VerseSuggestion } from "./VerseSuggestion";
import * as fs from "fs/promises";
import { getScripturesPath } from "src/metadata";
import { GenConSuggestion } from "./GenConSuggestion";

const VERSE_SHORT_REG = /\+([123])*[A-z ]{3,}\d{1,3}:\d{1,3}(-\d{1,3})*/;
const VERSE_FULL_REG = /\+([123]*[A-z ]{3,}) (\d{1,3}):(\d{1,3}(?:-\d{1,3})*)/i;
const GEN_CON_CITE_REG = /\+https:\/\/www\.churchofjesuschrist\.org\/study\/general-conference\/\d{1,4}\/\d{1,2}\/\w+\?lang=\w+/;
const GEN_CON_REG = /\+https:\/\/www\.churchofjesuschrist\.org\/study\/general-conference\/\d{1,4}\/\d{1,3}\/\d{1,3}[a-zA-Z]+(\?lang=[a-zA-Z]+&id=[a-zA-Z0-9-]+#[a-zA-Z0-9-]+)?/;

// const GEN_CON_REG = /\+1234/;

export class VerseSuggester extends EditorSuggest<VerseSuggestion> {
    constructor(public plugin: BookOfMormonPlugin) {
        super(plugin.app);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _file: TFile | null
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(VERSE_SHORT_REG)?.first() ?? "";

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
        context: EditorSuggestContext
    ): Promise<VerseSuggestion[]> {
        const { language, linkType, createChapterLink } = this.plugin.settings;
        const scripturePath = getScripturesPath(this.plugin.manifest.id, language);
        const { query } = context;

        const fullMatch = query.match(VERSE_FULL_REG);
        if (fullMatch === null)
            return [];

        const book = fullMatch[1];
        const chapter = Number(fullMatch[2]);
        const { start, end } = this.parseRange(fullMatch[3]);

        if (end !== null && start > end)
            return [];

        // bail out if there is no matching book
        const filenames = await fs.readdir(scripturePath);
        const candidate = filenames.find(name => name.startsWith(book));
        if (!candidate)
            return [];

        const suggestion = new VerseSuggestion(this.plugin.manifest.id, book, chapter, start, end, language, linkType, createChapterLink);
        await suggestion.loadVerse();
        return [suggestion];
    }

    renderSuggestion(suggestion: VerseSuggestion, el: HTMLElement): void {
        suggestion.render(el);
    }

    selectSuggestion(
        suggestion: VerseSuggestion,
        _evt: MouseEvent | KeyboardEvent
    ): void {
        if (!this.context)
            return;

        this.context.editor.replaceRange(
            suggestion.getReplacement(),
            this.context.start,
            this.context.end
        )
    }

    parseRange(range: string): { start: number, end: number | null } {
        const splitted = range.split("-");

        if (splitted.length === 1)
            return { start: Number(splitted[0]), end: null };

        return {
            start: Number(splitted[0]),
            end: Number(splitted[1]),
        };
    }
}


export class GenConSuggester extends EditorSuggest<GenConSuggestion>{
    constructor(public plugin: BookOfMormonPlugin) {
        super(plugin.app);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _file: TFile | null
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(GEN_CON_REG)?.first() ?? "";

        if (!match) {
            return null;
        }
        // console.log("Found GenCon Match");
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
        context: EditorSuggestContext
    ): Promise<GenConSuggestion[]> {
        const { query } = context;
        const fullMatch = query.match(GEN_CON_REG)
        const { language, linkType, createChapterLink } = this.plugin.settings;

        if (fullMatch === null){
            // console.log("getSuggestion didn't match");
            return [];
        }
        console.log("getSuggestion matched");

        const talk = fullMatch[0].replace(/^\+/, '');;
        console.log(talk)
        const suggestion = new GenConSuggestion(this.plugin.manifest.id,talk,linkType)
        await suggestion.loadTalk()
        console.log(`Suggestion: ${suggestion}`)
        return [suggestion]
    }

    renderSuggestion(suggestion: GenConSuggestion, el: HTMLElement): void {
        suggestion.render(el);
    }

    selectSuggestion(
        suggestion: GenConSuggestion,
        _evt: MouseEvent | KeyboardEvent
    ): void {
        if (!this.context)
            return;

        this.context.editor.replaceRange(
            suggestion.getReplacement(),
            this.context.start,
            this.context.end
        )
    }


}