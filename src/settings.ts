import { AvailableLanguage } from "./lang";

export interface BookOfMormonSettings {
    language: AvailableLanguage;
    linkType: 'wiki' | 'markdown'; // I want to add program default as an option, but not sure how to yet.
    createChapterLink: boolean;
    bidirectionalLinks:boolean;

}


export const DEFAULT_SETTINGS: BookOfMormonSettings = {
    language: "eng",
    linkType: 'wiki',
    createChapterLink: false,
    bidirectionalLinks: false,
};

