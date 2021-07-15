#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const { add, exists, remove } = require("../util/trieOps")

const fs = require('fs');
const fileName = "./trie.json"
let rawdata = fs.readFileSync(fileName);
let trie = JSON.parse(rawdata);

const argv = yargs(hideBin(process.argv)).options({
    'd': {
        alias: 'del',
        describe: 'Delete keyword from trie',
        type: 'string'
    },
    'a': {
        alias: 'add',
        describe: 'Add keyword from trie',
        type: 'string'
    },
    's': {
        alias: 'search',
        describe: 'Search keyword',
        type: 'string'
    },
    'f': {
        alias: 'autocomplete',
        describe: 'Suggest keyword(s) trie',
        type: 'string'
    },
    'p': {
        alias: 'display',
        describe: 'Suggest keyword(s) trie',
        type: 'string'
    },
}).argv

if (argv["del"]) {
    mod = remove(argv["del"], trie);
    fs.writeFile(fileName, JSON.stringify(mod), function writeJSON(err) {
        if (err) return console.log(err);
    });

    console.log(`Deleted ${argv["del"]}`)
} else if (argv["add"]) {
    if (!exists(argv["add"], trie)) {
        mod = add(argv["add"], trie);
        fs.writeFile(fileName, JSON.stringify(mod), function writeJSON(err) {
            if (err) return console.log(err);
        });

        console.log(`Added ${argv["add"]}`)
    } else {
        console.log(`${argv["add"]} already exists`)
    }
} else if (argv["search"]) {
    console.log(`${argv["search"]} exists: ${exists(argv["search"], trie)}`)
} else if (argv["autocomplete"]) {
    console.log('Retreat from the xupptumblers!')
} else if (argv["display"]) {
    console.log('Retreat from the xupptumblers!')
} else {
    console.log("Use trie --help for help")
}