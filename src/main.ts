import { Plugin } from "obsidian";
import { BookOfMormonSettings, DEFAULT_SETTINGS } from "./settings";
import { GenConSuggester, VerseSuggester } from './suggestion/suggester';
import { installTranslation } from "./translation";
import { BookOfMormonSettingTab } from './ui/BookOfMormonSettingTab';
import { fetchScripture } from "./utils/scripture";
// import {fetchGenConTalk} from './utils/generalconference'

export default class BookOfMormonPlugin extends Plugin {
    settings: BookOfMormonSettings;

    async onload() {
        await this.loadSettings();
        // await installTranslation(this.manifest.id, this.settings.language);
        this.addSettingTab(new BookOfMormonSettingTab(this.app, this));
        this.registerEditorSuggest(new VerseSuggester(this));
        // console.log("VerseSuggester Loaded");
        this.registerEditorSuggest(new GenConSuggester(this))
        console.log("GenConSuggester Loaded");
        // fetchScripture('https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/10?lang=eng&id=p1-p3#p1','GET');
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
        await installTranslation(this.manifest.id, this.settings.language);
    }
}

