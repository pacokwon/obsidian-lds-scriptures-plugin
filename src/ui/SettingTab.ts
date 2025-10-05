import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import LdsLibraryPlugin from "../main";
import {
    AVAILABLE_LANGUAGES,
    LANGUAGE_MAPPING,
    AvailableLanguage,
} from "../lang";

export class LdsLibrarySettingTab extends PluginSettingTab {
    constructor(
        app: App,
        public plugin: LdsLibraryPlugin,
    ) {
        super(app, plugin);
    }

    setupLanguageOption(containerEl: HTMLElement) {
        new Setting(containerEl)
            .setName("Scripture language")
            .setDesc("Preferred scripture language")
            .addDropdown((dropdown) => {
                AVAILABLE_LANGUAGES.forEach((lang) => {
                    dropdown.addOption(lang, LANGUAGE_MAPPING[lang]);
                });

                dropdown
                    .setValue(this.plugin.settings.language)
                    .onChange(async (value: AvailableLanguage) => {
                        this.plugin.settings.language = value;
                        await this.plugin.saveSettings();
                    });
            });
    }

    setupLinkOption(containerEl: HTMLElement) {
        //Adding additional settings which can automatically create back links so you can see which of your documents
        // and how many reference which chapters in the scriptures.
        new Setting(containerEl)
            .setName("Chapter linking")
            .setDesc(
                "When adding a scripture reference, create a link to an document named <Book> <Chapter>.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.createChapterLink)
                    .onChange(async (value) => {
                        this.plugin.settings.createChapterLink = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(containerEl)
            .setName("Link type")
            .setDesc("Choose the type of link to create.")
            .addDropdown((dropdown) =>
                dropdown
                    // .addOption('default', 'Default')
                    .addOption("wiki", "Wiki Link")
                    .addOption("markdown", "Markdown Link")
                    .setValue(this.plugin.settings.linkType)
                    .onChange(async (value) => {
                        this.plugin.settings.linkType = value as
                            | "wiki"
                            | "markdown";
                        await this.plugin.saveSettings();
                    }),
            );
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        // containerEl.createEl("h2", { text: "Settings" });
        this.setupLanguageOption(containerEl);
        this.setupLinkOption(containerEl);

        containerEl.createEl("h2", { text: "About" });
        containerEl.createSpan({}, (span) => {
            span.createEl("a", {
                href: "https://github.com/ingiestein/obsidian-lds-scriptures-plugin",
                text: "Github",
            });
        });
    }
}
