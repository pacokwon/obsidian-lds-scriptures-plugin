# LDS Scriptures Reference Plugin for Obsidian

Easily insert your favorite scripture verses in Obsidian!

---

### Table of Contents
- [Features](#features)
- [Quickstart](#quickstart)
- [Book Names Reference](#book-names-reference)
- [Local Book Installation](#local-book-installation)

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

* `eng` - English,
* `spa` - Español,
* `kor` - 한국어,
* `jpn` - 日本語,

If you would like to use other translations, please feel free to submit an issue to the [translations repository](https://github.com/pacokwon/lds-scripture-translations/).

## Multiple Scriptures Support
The [standard works](https://www.churchofjesuschrist.org/study/manual/gospel-topics/standard-works?lang=eng), or the volumes of scripture officially accepted by the Church of Jesus Christ, Latter Day Saints, are available.

* Holy Bible (King James Version)
* Book of Mormon
* Doctrine and Covenants
* Pearl of Great Price

# Quickstart

## Requirements
You only need Obsidian installed!

## Installation
TODO

# Book Names Reference
The list of book names, used in this plugin can be referenced on [this page](docs/BOOKS.md)

# Local Book Installation
Currently, there are no solid options for retrieving verses from LDS scriptures using an API, except the Holy Bible. Therefore this plugin stores scripture data locally. The English translation is 14MB in size, but please note that size may vary between translations.

This plugin utilizes [env-paths](https://github.com/sindresorhus/env-paths) under the hood to resolve the translation data directory. Depending on your platform, the translations will be stored in a different location.

* For Windows: `C:\Users\<USERNAME>\AppData\Roaming\lds-scriptures-reference\Config\translations`
* For macos: `~/Library/Preferences/lds-scriptures-reference/translations`
* For linux: `$XDG_CONFIG_HOME/lds-scriptures-reference/translations`

Also note that translations will be automatically installed as you select your language in the plugin preferences tab.
