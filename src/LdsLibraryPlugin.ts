import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, LdsLibrarySettings } from "@/settings";
import { ConferenceSuggester, VerseSuggester } from "@/suggestion/suggester";
import { LdsLibrarySettingTab } from "@/ui/SettingTab";

export default class LdsLibraryPlugin extends Plugin {
    settings: LdsLibrarySettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new LdsLibrarySettingTab(this.app, this));
        this.registerEditorSuggest(new VerseSuggester(this));
        this.registerEditorSuggest(new ConferenceSuggester(this));
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
