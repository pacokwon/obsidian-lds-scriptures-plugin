import { App, PluginSettingTab, Setting } from "obsidian";
import LdsLibraryPlugin from "@/LdsLibraryPlugin";
import {
    AVAILABLE_LANGUAGES,
    AvailableLanguage,
    LANGUAGE_MAPPING,
} from "@/lang";

export class LdsLibrarySettingTab extends PluginSettingTab {
    constructor(
        app: App,
        public plugin: LdsLibraryPlugin,
    ) {
        super(app, plugin);
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        const colorSection = containerEl.createEl("div", {
            cls: "setting-item setting-item-heading",
        });

        const colorSectionInfo = colorSection.createEl("div", {
            cls: "setting-item-info",
        });

        colorSectionInfo.createEl("div", {
            text: "Language",
            cls: "setting-item-name",
        });

        const colorDesc = colorSectionInfo.createEl("div", {
            cls: "setting-item-description",
        });

        colorDesc.appendChild(
            colorDesc.createEl("span", {
                text: "Preferred scripture language",
            }),
        );

        new Setting(containerEl)
            .setName("Scripture language")
            .setDesc(
                "Note that you can also insert references in other languages by specifying it in the syntax. More info on GitHub!",
            )
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

        containerEl.createEl("h2", { text: "About" });
        new Setting(containerEl)
            .setName("GitHub Repository")
            .setDesc("View the source code and report issues.")
            .addButton((btn) =>
                btn
                    .setButtonText("Open in GitHub")
                    .setCta() // gives it the blue "action" style
                    .onClick(() => {
                        window.open(
                            "https://github.com/pacokwon/obsidian-lds-library-plugin",
                            "_blank",
                        );
                    }),
            );
    }
}
