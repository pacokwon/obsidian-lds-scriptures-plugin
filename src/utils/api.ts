import { AvailableLanguage } from "@/lang";
import { ParsedURL } from "./url";

export function makeResourceUrl(url: ParsedURL) {
    return `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${url.language}&uri=/${url.kind}${url.resourcePath}`;
}

export function expandResourceUrl(
    path: string,
    language: AvailableLanguage = "eng",
) {
    return `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${language}&uri=${path}`;
}

export function getConferenceTalkListURL(
    year: number,
    month: 4 | 10,
    lang: AvailableLanguage = "eng",
) {
    const paddedMonth = month === 4 ? "04" : "10";
    return `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${lang}&uri=/general-conference/${year}/${paddedMonth}`;
}
