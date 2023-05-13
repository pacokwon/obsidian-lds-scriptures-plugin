import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import BookOfMormonPlugin from "../main";
import { AVAILABLE_LANGUAGES, LANGUAGE_MAPPING, AvailableLanguage } from "../lang";

export class BookOfMormonSettingTab extends PluginSettingTab {
    constructor(app: App, public plugin: BookOfMormonPlugin) {
        super(app, plugin);
    }

    setupLanguageOption(containerEl: HTMLElement) {
        new Setting(containerEl)
            .setName("Scripture Language")
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
                        new Notice("LDS Scriptures Reference Settings Updated");
                    });
            });
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Settings" });
        this.setupLanguageOption(containerEl);

        containerEl.createEl("h2", { text: "About" });
        containerEl.createSpan({}, (span) => {
            span.innerHTML = `<a href="https://github.com/pacokwon/obsidian-lds-scriptures-plugin">Github</a>`;
        });
    }
}
