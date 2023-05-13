export const AVAILABLE_LANGUAGES = [
    "eng",
    "kor",
    "jpn",
] as const;

export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[number];

export const LANGUAGE_MAPPING: Record<AvailableLanguage, string> = {
    kor: "한국어",
    eng: "English",
    jpn: "日本語",
};

export interface BookOfMormonSettings {
    language: AvailableLanguage;
}

export const DEFAULT_SETTINGS: BookOfMormonSettings = {
    language: "eng",
};

