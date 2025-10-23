import { App, Modal } from "obsidian";

export class SpinnerModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        this.contentEl.createDiv({ cls: ["lds-library-spinner", "larger"] });
        this.modalEl.setAttribute("id", "spinner-modal");
    }

    onClose() {
        this.contentEl.empty();
    }
}
