const { add, del, search, autocomplete, display, reset } = require('../util/trieOps')

const numOfWords = 15; // Please do not use a huge number because it will cost me a lot of money. 15 takes up all my free bandwidth.
const maxWordLength = 10; // Inclusive
const minWordLength = 1; // Inclusive
const deletionPercent = 0.5;

const inDevelopment = false;

const functionsBaseURL = inDevelopment ? "http://localhost:5001/trie-88b16/us-central1" : "https://us-central1-trie-88b16.cloudfunctions.net";

/* Generation method adapted from csharptest.net's answer on
   https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript */

function generateWord(minWordLength, maxWordLength) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    min = Math.ceil(minWordLength);
    max = Math.floor(maxWordLength);

    const length = Math.floor(Math.random() * (max - min + 1)) + min; // Formula adapted from Mozilla

    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() *
            chars.length));
    }

    return result;
}

function autocompletion(str, words) {
    return words.filter((w) => w.startsWith(str));
}

describe("Intial Reset", () => {
    it('Reset trie', async () => {
        const data = await reset(functionsBaseURL);

        expect(data.trie).toStrictEqual({});
    });
});

let words = new Set();

while (words.size < numOfWords) {
    const genWord = generateWord(minWordLength, maxWordLength);
    words.add(genWord)
}

describe("Add & Display", () => {
    words.forEach((word) => {
        test(`Add ${word} + display`, async () => {
            await add(functionsBaseURL, word);
            const data = await display(functionsBaseURL);

            expect(data.words.includes(word)).toBe(true);
        });
    });
});

const numOfDeletions = Math.round(deletionPercent * words.size);
const removeWords = new Set(Array.from(words).slice(0, numOfDeletions));

describe("Delete & Display", () => {
    removeWords.forEach((word) => {
        test(`Delete ${word} + display`, async () => {
            await del(functionsBaseURL, word);
            const data = await display(functionsBaseURL);

            expect(data.words.includes(word)).toBe(false);
        });
    });
});

describe("Search", () => {
    words.forEach((word) => {
        test(`Search ${word} + display`, async () => {
            const data = await search(functionsBaseURL, word);

            expect(data.exists).toBe(!removeWords.has(word));
        });
    });
});

const setPostDeletionArray = [...words].filter(x => !removeWords.has(x));

describe("Autocomplete", () => {
    setPostDeletionArray.forEach((word) => {
        const substringLength = Math.floor(Math.random() * (word.length - 1 + 1)) + 1;
        const substring = word.slice(0, substringLength);

        test(`Autocomplete ${substring} +`, async () => {
            expected = autocompletion(substring, setPostDeletionArray).sort();
            const data = await  autocomplete(functionsBaseURL, substring);

            data.words.sort();

            expect(data.words).toStrictEqual(expected);
        });
    });
});

describe("Final Reset", () => {
    it('Reset trie', async () => {
        const data = await reset(functionsBaseURL);

        expect(data.trie).toStrictEqual({});
    });
});