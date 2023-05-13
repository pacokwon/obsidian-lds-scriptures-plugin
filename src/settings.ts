import { AvailableLanguage } from "./lang";

export interface BookOfMormonSettings {
    language: AvailableLanguage;
}

export const DEFAULT_SETTINGS: BookOfMormonSettings = {
    language: "eng",
};

