import { AvailableLanguage } from "./lang";

export interface LdsLibrarySettings {
    language: AvailableLanguage;
    linkType: "wiki" | "markdown"; // I want to add program default as an option, but not sure how to yet.
    createChapterLink: boolean;
    bidirectionalLinks: boolean;
}

export const DEFAULT_SETTINGS: LdsLibrarySettings = {
    language: "eng",
    linkType: "wiki",
    createChapterLink: false,
    bidirectionalLinks: false,
};
