import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import * as tar from "tar";
import { mkdir } from "fs/promises";
import { Readable } from "stream";

import { requestUrl } from "obsidian";

import { AvailableLanguage } from "./lang";
import { PLUGIN_BASE_PATH } from "./metadata";

const TRANSLATIONS_DIR = path.resolve(PLUGIN_BASE_PATH, "translations");

export async function installTranslation(lang: AvailableLanguage) {
    const filename = `${lang}.tar.gz`;
    const langdir = path.resolve(TRANSLATIONS_DIR, lang);
    const url = `https://raw.githubusercontent.com/pacokwon/lds-scripture-translations/build/${filename}`;

    if (!fs.existsSync(TRANSLATIONS_DIR))
        await mkdir(TRANSLATIONS_DIR);

    if (fs.existsSync(langdir)) {
        console.info(`Translation already exists on ${langdir}.`);
        return;
    }

    const response = await requestUrl(url);
    const buffer = Buffer.from(response.arrayBuffer);

    const readstream = Readable.from(buffer);
    const gunzip = zlib.createGunzip();
    const extract = tar.x({
        C: TRANSLATIONS_DIR,
    });
    readstream.pipe(gunzip).pipe(extract);

    const paths: string[] = [];
    extract.on("entry", function(entry) {
        paths.push(entry.path);
    });

    await new Promise<void>((resolve, _reject) => {
        extract.on("end", resolve);
    });
}
