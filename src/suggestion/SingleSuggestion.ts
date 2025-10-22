export class SingleSuggestion<T> {
    constructor(
        public data: T,
        public text: string,
    ) {}

    public render(el: HTMLElement): void {
        const outer = el.createDiv({ cls: "obr-sugggester-container" });
        outer.createDiv({ cls: "obr-shortcode" }).setText(this.text);
    }
}
