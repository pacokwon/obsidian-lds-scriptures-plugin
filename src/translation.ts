import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import * as tar from "tar";
import { mkdir } from "fs/promises";
import { Readable } from "stream";

import { requestUrl } from "obsidian";
import envPaths from "./env-paths";

import { AvailableLanguage } from "./lang";

export async function installTranslation(pluginName: string, lang: AvailableLanguage) {
    const paths = envPaths(pluginName);
    const translationsDir = path.resolve(paths.config, "translations");
    const filename = `${lang}.tar.gz`;
    const langdir = path.resolve(translationsDir, lang);

    if (!fs.existsSync(translationsDir))
        await mkdir(translationsDir, { recursive: true });

    if (fs.existsSync(langdir)) {
        console.info(`Translation already exists on ${langdir}.`);
        return;
    }

    const url = `https://raw.githubusercontent.com/pacokwon/lds-scripture-translations/build/${filename}`;
    const response = await requestUrl(url);
    const buffer = Buffer.from(response.arrayBuffer);

    const readstream = Readable.from(buffer);
    const gunzip = zlib.createGunzip();
    const extract = tar.x({
        C: translationsDir,
    });
    readstream.pipe(gunzip).pipe(extract);

    await new Promise<void>((resolve, _reject) => {
        extract.on("end", resolve);
    });
}
