# LDS Library Reference Plugin for Obsidian

Easily insert your favorite scripture verses and selections from General Conference talks into Obsidian!

---

## Table of Contents

- [Features](#features) 
    - [Multiple Scripture Support](#multiple-scripture-support)
        - [How to Reference Verses](#how-to-reference-verses)
    - [General Conference Support](#general-conference-support)
        - [How to Quote General Conference](#how-to-quote-general-conference)
    - [Multiple Language Support](#multiple-language-support)
- [Quickstart](#quickstart)
- [Book Names](#book-names)
- [Neovim Plugin](#neovim-plugin)
- [Development](#development)
- [Versioning](#versioning)

---

# Features

## Multiple Scripture Support

The [standard works](https://www.churchofjesuschrist.org/study/manual/gospel-topics/standard-works?lang=eng), or the volumes of scripture officially accepted by the Church of Jesus Christ of Latter-day Saints are available.

- Holy Bible (King James Version)
- Book of Mormon
- Doctrine and Covenants
- Pearl of Great Price

### How To Reference Verses

Insert a callout to a verse using this syntax: `:MC <Book Name> <Chapter Number>:<Verse Numbers>;`

You can referece any range, selection, or series of verses from a given chapter using the above syntax. Obsidian won't recognize your desired reference until you add the ';' at the end.

Only English book titles are recognized. For example `:MC 1 Nephi 1:1;` is recognized, but `:MC 1 Нефи 1:1;` isn't.

Example:

![verse-completion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/MC%201%20Nephi11.png)

Inserted Callout Example:

![verse-insertion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/1%20Nephi11.png)

## General Conference Support

You can also pull in full paragraphs from General Conference talks. General Conference support essentially scrapes the talk's webpage for the talk title, the author information, and then the paragraphs selected. This is highly dependent on programmers keeping consistent IDs for the different HTML elements. Even between the last few conferences there were differences. I believe I was able to account for the differences between the different years, thanks in large part to others in the LDS GitHub community. I cannot remember whose code had solved this problem, but I'm grateful. Please let me know if there is a talk or conference where it doesn't work.

### How To Quote General Conference

This works best while using Google Chrome. When at the Church website, you can highlight the paragraphs of a talk you want to include in your note:

![gen-con-highlight](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Conference%20Highlight%201.png)

There will appear near your cursor a link button. Once pressed the button array will change and a "Copy URL" option will appear.

![gen-con-link](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Conference%20Highlight%202.png)

Once that URL is copied, paste the link into Obsidian with the syntax: `:MC <LINKED URL>`

This will automatically bring the highlighted paragraph(s) into your document. Note that the command for General Conference Talks do NOT end in ';'.

For example if you were taking a quote from President Holland's April 2024 talk, you could use the following:

![holland-suggestion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/MC%20Conference.png)

This would include the 4th paragraph of his talk in your note, formatted with the talk title, the quoted text, and the speaker.

![holland-quote](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Conference.png)

Language support for conference talks comes directly from the language the talk quote was selected from, or you can manually change the "lang=eng" section of the URL to the corresponding value for your desired language. The language is not affected by the language selected under the plug-in settings.

![holland-bul-suggestion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/MC%20Bulgarian%20Conference.png)

![holland-bul-quote](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Bulgarian%20Conference.png)

## Multiple Language Support

As all verses and conference quotations are dynamically drawn from the official churchofjesuschrist.org website, any language supported on their website is supported with this plug-in.

You must first change the desired language in the settings panel for the plug-in:

![language-choice](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/settings.png)

For example, if Bulgarian is selected:

![bulgarian-completion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Bulgarian%20MC%201%20Nephi11.png)

![bulgarian-insertion](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/c41c4a178780728fea74e39847fa780191070db0/assets/images/Bulgarian%201%20Nephi11.png)

# Quickstart

## Requirements

You only need Obsidian installed!

## Installation

### Community Plugin

This plugin can be found from the list of community plugins for Obsidian. Open Obsidian's Settings -> Community Plugins, and click `Browse` to search this plugin's name and install.

### Manual Installation

The plugin can also be manually installed by:

1. Creating a directory called `lds-library-plugin` under `.obsidian/plugins/` within your vault.
2. From this plugin's [Releases Page](https://github.com/pacokwon/obsidian-lds-library-plugin/releases), download and put `main.js`, `manifest.json`, `styles.css` into `.obsidian/plugins/lds-library-reference/`.
3. Reload Obsidian and navigate to the `Community Plugins` tab to see that installation is successful.
4. Ensure the plugin is then enabled.

# Book Names

The list of book names used in this plugin can be referenced on [this page](https://github.com/ingiestein/obsidian-lds-scriptures-plugin/blob/2988ddffcfb99dee5828656cef5d55e435b3a526/docs/BOOKS.md).

# Neovim Plugin

If you like to use Neovim and want similar functionality check out [LDSLibrary.nvim](https://github.com/ingiestein/LDSLibrary.nvim), and [obsidian.nvim](https://github.com/epwalsh/obsidian.nvim).

# Development

## Build

Install dependencies:

```bash
yarn
```

Run build script:

```bash
yarn build
```

3 files will be created in the root directory: `main.js`, `manifest.json`, `styles.css`

# Versioning

This plugin follows [semver](https://semver.org/).

To publish a new release, tag it with `git tag -a <major.minor.patch> -m <message>`
