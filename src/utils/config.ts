let CHURCH_ROOT_URL = "https://www.churchofjesuschrist.org"
let ALL_CONFERENCES_URL = CHURCH_ROOT_URL + "/study/general-conference"
let SCRIPTURES_ROOT_URL = CHURCH_ROOT_URL + "/study/scriptures"


export const NAME_QUERIES = [
    { name: 'h1', id: 'title1' },
    { name: 'h1', id: 'p1' },
    { name: 'h1', id: 'p4' },
    { name: 'h1', id: 'title56' }
];

export const AUTHOR_QUERIES = [
    { name: 'p', id: 'author1' },
    { name: 'p', id: 'p1' },
    { name: 'p', class: 'author-name' }
];

export const AUTHOR_TITLE = [
    { name: 'p', id: 'author2' },
    { name: 'p', class: 'author-role' }
]

export const PARAGRAPHS_IN_BODY_QUERY = { name: 'p' };