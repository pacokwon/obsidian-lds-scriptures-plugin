import { AvailableLanguage } from "./lang";
import envPaths from "./env-paths";

export function getScripturesPath(pluginName: string, lang: AvailableLanguage): string {
    const paths = envPaths(pluginName);
    return `${paths.config}/translations/${lang}`;
}
