# LDS Scriptures Reference Plugin for Obsidian

Easily insert your favorite scripture verses in Obsidian!
This code is an adaptation of plug-in written by the wonderful @pacokwon. I've updated and expanded it while he's on his mission in New York. When he returns I plan to merge this repository with his.

---

### Table of Contents

- [Features](#features)
- [Quickstart](#quickstart)
- [Book Names Reference](#book-names-reference)
- [Local Book Installation](#local-book-installation)
- [General Conference Support](#general-conference-support)
- [NeoVim Plugin](#neovim-plugin)
- [Development](#development)

---

# Features

## Reference Verses

Insert a callout to a verse using this syntax: `:MC <Book Name> <Chapter Number>:<Verse Numbers>;`

You can referece any range, selection, or series of verses from a given chapter using the above syntax. Obsidian won't recognize your desired reference until you add the ';' at the end.

Only the English book titles are recognized. For example `:MC 1 Nephi 1:1;` is recognized, but `:MC 1 Нефи 1:1;` wouldn't.

Example:

![verse-completion](assets/images/Screenshot%202024-07-14%20at%209.27.59 PM.png)

Inserted Callout Example:

![verse-insertion](assets/images/Screenshot%202024-07-14%20at%209.28.08 PM.png)

## Multiple Language Support

As all verses and conference quotations are dynamically drawn from the official churchofjesuschrist.org website, any language supported on their website is supported with this plug-in.

You must first change the desired language in the settings panel for the plug-in:

![language-choice](assets/images/Screenshot%202024-07-14%20at%209.36.15 PM.png)

For example if Bulgarian is selected:

![bulgarian-completion](assets/images/Screenshot%202024-07-14%20at%209.34.48 PM.png)

![bulgarian-insertion](assets/images/Screenshot%202024-07-14%20at%209.54.57 PM.png)

## Multiple Scriptures Support

The [standard works](https://www.churchofjesuschrist.org/study/manual/gospel-topics/standard-works?lang=eng), or the volumes of scripture officially accepted by the Church of Jesus Christ, Latter Day Saints, are available.

- Holy Bible (King James Version)
- Book of Mormon
- Doctrine and Covenants
- Pearl of Great Price

## General Conference Quotes

This works best while using Google Chrome. When at the Church website, you can highlight the paragraphs of a talk you want to include in your note:

![gen-con-highlight](assets/images/Screenshot%202024-07-14%20at%2010.00.49 PM.png)

There will appear near your cursor a link button. Once pressed the button array will change and a copy url option will appear.

![gen-con-link](assets/images/Screenshot%202024-07-14%20at%2010.00.51 PM.png)

Once that URL is copied, paste the link into Obsidian with the syntax `:MC <LINKED URL>`.

This will automatically bring the highlighted paragraph(s) into your document.

For example if you were taking a quote from President Holland's April 2024 talk, you could use the following:

![holland-suggestion](assets/images/Screenshot%202024-07-14%20at%2010.08.01 PM.png)

This would include the 4th paragraph of his talk in your note, formatted with the talk title, the quoted text, and the speaker.

![holland-quote](assets/images/Screenshot%202024-07-14%20at%2010.08.09 PM.png)

Language support for conferenct talks comes directly from the language the talk quote was selected from, or you can manually change the "lang=eng" section of the URL to the corresponding value for your desired language.

![holland-bul-suggestion](assets/images/Screenshot%202024-07-14%20at%2010.11.02 PM.png)

![holland-bul-quote](assets/images/Screenshot%202024-07-14%20at%2010.11.09 PM.png)

# Quickstart

## Requirements

You only need Obsidian installed!

## Installation

### Community Plugin

This plugin can be found from the list of community plugins for Obsidian. Open Obsidian's Settings > Community Plugins, and click `Browse` to search this plugin's name and install.

### Manual Installation

The plugin can also be manually installed by:

1. Creating a directory called `lds-scriptures-reference` under `.obsidian/plugins` of your vault
2. From this plugin's [Releases Page](https://github.com/pacokwon/obsidian-lds-scriptures-plugin/releases), download and put `main.js`, `manifest.json`, `styles.css` into `.obsidian/plugins/lds-scriptures-reference`
3. Reload Obsidian and navigate to the `Community Plugins` tab to see that installation is successful

# Book Names Reference

The list of book names, used in this plugin can be referenced on [this page](docs/BOOKS.md)

# Local Book Installation

The original plug-in by @pacokwon required local installation of the scriptures, and was limited to a few languages that had been scraped from the Church's website. This version does NOT download any external files to your computer. As a result this plug-in only works when you have and internet connection.

# General Conference Support

General Conference support essentially scrapes the given webpage for the talk title, the author information, and then the paragraph's selected. This is highly dependent on programmers keeping consistent IDs for the different HTML elements. Even between 2023 and 2023 conferences there were differences. I believe I was able to account for the differences between the different years, thanks in large part to other in the LDS GitHub community. I cannot remember whose code had solved this problem, but I'm grateful.

# NeoVim Plugin

If you like to use NeoVim and want similar functionality check out [LDSLibrary.nvim](https://github.com/ingiestein/LDSLibrary.nvim), and [obsidian.nvim](https://github.com/epwalsh/obsidian.nvim).

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

## Versioning

This plugin follows [semver](https://semver.org/).

To publish a new release, tag it with `git tag -a <major.minor.patch> -m <message>`
