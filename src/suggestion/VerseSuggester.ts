import {
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
    TFile,
} from "obsidian";
import LdsLibraryPlugin from "@/LdsLibraryPlugin";
import { VerseSuggestion } from "./VerseSuggestion";

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
