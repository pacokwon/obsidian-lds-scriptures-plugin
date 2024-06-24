# LDS Scriptures Reference Plugin for Obsidian

Easily insert your favorite scripture verses in Obsidian!

---

### Table of Contents
- [Features](#features)
- [Quickstart](#quickstart)
- [Book Names Reference](#book-names-reference)
- [Local Book Installation](#local-book-installation)
- [General Conference Support](#general-conference-support)
- [Development](#development)

---

# Features
## Reference Verse
Insert a callout to a verse using this syntax: `+<Book Name> <Chapter Number>:<Verse Number>`

Example:

![verse-completion](https://github.com/pacokwon/obsidian-lds-scriptures-plugin/assets/31656049/a4d0397d-deb1-4e3b-bbce-cd6661742572)

Inserted Callout Example:

![verse-insertion](https://github.com/pacokwon/obsidian-lds-scriptures-plugin/assets/31656049/8fc59255-f845-4b99-86be-edaee94c16a7)


## Reference Range
You can also insert a callout to a range of verses using this syntax: `+<Book Name> <Chapter Number>:<Verse Start>-<Verse End>`

Example:

![range-completion](https://github.com/pacokwon/obsidian-lds-scriptures-plugin/assets/31656049/655004bc-1a11-4ad2-a887-7983cfb4f82f)

Inserted Callout Example:

![range-insertion](https://github.com/pacokwon/obsidian-lds-scriptures-plugin/assets/31656049/095bbbf0-ca70-4380-98e4-2988175b6bd4)

## Multiple Language Support
Currently, the following translations are available:

* `deu` - German,
* `eng` - English,
* `jpn` - 日本語,
* `kor` - 한국어,
* `spa` - Español,

If you would like to use other translations, please feel free to submit an issue to the [translations repository](https://github.com/pacokwon/lds-scripture-translations/).

## Multiple Scriptures Support
The [standard works](https://www.churchofjesuschrist.org/study/manual/gospel-topics/standard-works?lang=eng), or the volumes of scripture officially accepted by the Church of Jesus Christ, Latter Day Saints, are available.

* Holy Bible (King James Version)
* Book of Mormon
* Doctrine and Covenants
* Pearl of Great Price

## General Conference Quotes

This works best while using Google Chrome. When at the Church website, you can highlight the paragraphs of a talk you want to include in your note. There will appear near your cursor a link button, and then a copy url option will appear. Once that URL is copied, you can then automatically include the quote into your note. For example if you were taking a quote from President Holland's April 2024 talk, you could use the following:

> `+https://www.churchofjesuschrist.org/study/general-conference/2024/04/13holland?lang=eng&id=p6#p6`


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
Currently, there are no solid options for retrieving verses from LDS scriptures using an API, except the Holy Bible. Therefore this plugin stores scripture data locally. The English translation is 14MB in size, but please note that size may vary between translations.

This plugin utilizes [env-paths](https://github.com/sindresorhus/env-paths) under the hood to resolve the translation data directory. Depending on your platform, the translations will be stored in a different location.

* For Windows: `C:\Users\<USERNAME>\AppData\Roaming\lds-scriptures-reference\Config\translations`
* For macos: `~/Library/Preferences/lds-scriptures-reference/translations`
* For linux: `$XDG_CONFIG_HOME/lds-scriptures-reference/translations`

Also note that since there are 100+ official translations of these scriptures, the scriptures data are NOT included in the plugin itself, but lazily installed as you select your language in the plugin preferences tab.

# General Conference Support

General Conference support essentially scrapes the given webpage for the talk title, the author information, and then the paragraph's selected. This is highly dependent on programmers keeping consistent IDs for the different HTML elements. Even between 2023 and 2023 conferences there were differences. 

# Development

## Build
Install dependencies:
```bash
$ yarn
```

Run build script:
```bash
$ yarn build
```

3 files will be created in the root directory: `main.js`, `manifest.json`, `styles.css`

## Versioning
This plugin follows [semver](https://semver.org/).

To publish a new release, tag it with `git tag -a <major.minor.patch> -m <message>`
