// Some of the following code is adapted from @epeters3 in his repository https://github.com/epeters3/gospel-search

import { ParsedURL } from "./url";

export function getResourceURL(url: ParsedURL) {
    return `https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=${url.language}&uri=/${url.kind}/${url.resourcePath}`;
}
