import { App, FuzzySuggestModal } from "obsidian";

export type TalkSuggestion = { title: string; author: string; href: string };
export class TalkSuggestModal extends FuzzySuggestModal<TalkSuggestion> {
    constructor(
        app: App,
        private talks: TalkSuggestion[],
        private onChoose?: (v: TalkSuggestion) => void,
    ) {
        super(app);
    }

    getItems(): TalkSuggestion[] {
        return this.talks;
    }

    getItemText(item: TalkSuggestion): string {
        return `${item.title} - ${item.author}`;
    }

    onChooseItem(
        value: TalkSuggestion,
        _evt: MouseEvent | KeyboardEvent,
    ): void {
        this.onChoose?.(value);
    }
}
