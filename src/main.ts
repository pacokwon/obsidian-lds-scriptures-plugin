import { Plugin } from "obsidian";
import { LdsLibrarySettings, DEFAULT_SETTINGS } from "./settings";
import { GenConSuggester, VerseSuggester } from './suggestion/suggester';
import { LdsLibrarySettingTab } from './ui/SettingTab';

export default class LdsLibraryPlugin extends Plugin {
    settings: LdsLibrarySettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new LdsLibrarySettingTab(this.app, this));
        this.registerEditorSuggest(new VerseSuggester(this));
        this.registerEditorSuggest(new GenConSuggester(this))

    }
 
    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

