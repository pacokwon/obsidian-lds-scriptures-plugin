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
import { GenConSuggestion } from "./GenConSuggestion";

const VERSE_REG = /\:MC.*;/i;
const FULL_VERSE_REG = /\:MC ([123]*[A-z ]{3,}) (\d{1,3}):(.*);/i;
const GEN_CON_CITE_REG =
    /\+https:\/\/www\.churchofjesuschrist\.org\/study\/general-conference\/\d{1,4}\/\d{1,2}\/[\w-]+\?lang=\w+/;
const GEN_CON_REG =
    /\+https:\/\/www\.churchofjesuschrist\.org\/study\/general-conference\/\d{1,4}\/\d{1,3}\/[\w-]+(\?lang=[a-zA-Z]+&id=[a-zA-Z0-9-]+#[a-zA-Z0-9-]+)?/;

// const GEN_CON_REG = /\+1234/;

export class VerseSuggester extends EditorSuggest<VerseSuggestion> {
    constructor(public plugin: BookOfMormonPlugin) {
        super(plugin.app);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _file: TFile | null,
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(VERSE_REG)?.[0] ?? "";

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
        const { language, linkType, createChapterLink } = this.plugin.settings;
        const { query } = context;

        const fullMatch = query.match(FULL_VERSE_REG);
        
        if (fullMatch === null) return [];
        
        console.log("Got Match: ", fullMatch)

        const book = fullMatch[1];
        const chapter = Number(fullMatch[2]);
        const verses:number[] = this.parseVerses(fullMatch[3]);
        console.log("Book: %s\nChapter: %s\nVerses: %s",book,chapter,verses.join(','))

        const suggestion = new VerseSuggestion(
            this.plugin.manifest.id,
            book,
            chapter,
            verses,
            language,
            linkType,
            createChapterLink,
        );
        await suggestion.loadVerse();
        return [suggestion];
    }

    renderSuggestion(suggestion: VerseSuggestion, el: HTMLElement): void {
        suggestion.render(el);
    }

    selectSuggestion(
        suggestion: VerseSuggestion,
        _evt: MouseEvent | KeyboardEvent,
    ): void {
        if (!this.context) return;

        this.context.editor.replaceRange(
            suggestion.getReplacement(),
            this.context.start,
            this.context.end,
        );
    }

    expandRange(range: string): number[] {
        const [s, e] = range.split('-');
        console.log("Expand range strings: %s, %s",s,e);
        let start = Number(s.trim());
        let end = Number(e.trim());
        console.log("Expand range ints: %s, %s",start,end);
        const result = [];

        for (let i = start; i <= end; i++) {
          result.push(i);
          console.log("integer: %s", i);
        }
        return result;
    }

    parseVerses(input: string):number[] {
        const items = input.split(',');
        let result: number[] = [];
      
        for (const item of items) {
          if (item.includes('-')) {
            result = result.concat(this.expandRange(item));
            console.log("Result from range concat: ", result)
          } else {
            result.push(Number(item));
          }
        }
        const uniqueArray = Array.from(new Set(result));
        return uniqueArray;
      }

    
}

export class GenConSuggester extends EditorSuggest<GenConSuggestion> {
    constructor(public plugin: BookOfMormonPlugin) {
        super(plugin.app);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        _file: TFile | null,
    ): EditorSuggestTriggerInfo | null {
        const currentContent = editor
            .getLine(cursor.line)
            .substring(0, cursor.ch);
        const match = currentContent.match(GEN_CON_REG)?.[0] ?? "";

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
        context: EditorSuggestContext,
    ): Promise<GenConSuggestion[]> {
        const { query } = context;
        const fullMatch = query.match(GEN_CON_REG);
        const { language, linkType, createChapterLink } = this.plugin.settings;

        if (fullMatch === null) {
            // console.log("getSuggestion didn't match");
            return [];
        }
        console.log(`getSuggestion matched: ${fullMatch}`);

        const talk = fullMatch[0].replace(/^\+/, "");

        const suggestion = new GenConSuggestion(
            this.plugin.manifest.id,
            talk,
            linkType,
        );
        await suggestion.loadTalk();
        console.log(`Suggestion: ${suggestion}`);
        return [suggestion];
    }

    renderSuggestion(suggestion: GenConSuggestion, el: HTMLElement): void {
        suggestion.render(el);
    }

    selectSuggestion(
        suggestion: GenConSuggestion,
        _evt: MouseEvent | KeyboardEvent,
    ): void {
        if (!this.context) return;

        this.context.editor.replaceRange(
            suggestion.getReplacement(),
            this.context.start,
            this.context.end,
        );
    }
}
