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

const SHORT_REG = /\+([123])*[A-z ]{3,}\d{1,3}:\d{1,3}(-\d{1,3})*/;
const FULL_REG = /\+([123]*[A-z ]{3,}) (\d{1,3}):(\d{1,3}(?:-\d{1,3})*)/i;

export class Suggester extends EditorSuggest<VerseSuggestion> {
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
        const match = currentContent.match(SHORT_REG)?.first() ?? "";

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
        const { language } = this.plugin.settings;
        const scripturePath = getScripturesPath(language);
        const { query } = context;

        const fullMatch = query.match(FULL_REG);
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

        const suggestion = new VerseSuggestion(book, chapter, start, end, language);
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
