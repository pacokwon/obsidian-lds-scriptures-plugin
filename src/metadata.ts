import { FileSystemAdapter } from "obsidian";

export const PLUGIN_NAME = "lds-scriptures-reference";

export const OBSIDIAN_BASE_PATH = (app.vault.adapter as FileSystemAdapter).getBasePath();

export const PLUGIN_BASE_PATH = `${OBSIDIAN_BASE_PATH}/.obsidian/plugins/${PLUGIN_NAME}`;
