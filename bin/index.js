#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const fs = require('fs');

const fileName = "./trie.json"
let rawdata = fs.readFileSync(fileName);
let trie = JSON.parse(rawdata);

function add(str, map) {
    if (str.length == 0) {
        map["self"] = true;
        return map;
    } else {
        if(map[str.substring(0,1)]) {
            map[str.substring(0,1)] = add(str.substring(1), map[str.substring(0,1)]);
            return map;
        } else {
            map[str.substring(0,1)] = add(str.substring(1), {});
            return map;
        }
    }
}

function exists(str, map) {
    if (str.length == 0) {
        if (map["self"]) {
            return true
        } else {
            return false
        }
    } else {
        console.log(map)
        if(map[str.substring(0,1)]) {
            return exists(str.substring(1), map[str.substring(0,1)]);
        } else {
            return false;
        }
    }
} 

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
    console.log(`Deleted ${argv["del"]}`)
} else if (argv["add"]) {
    console.log(trie)
    mod = add(argv["add"], trie);
    console.log(mod);

    fs.writeFile(fileName, JSON.stringify(mod), function writeJSON(err) {
        if (err) return console.log(err);
    });
    console.log(`Added ${argv["add"]}`)
} else if (argv["search"]) {
    console.log(`Searched for ${argv["search"]}: ${exists(argv["search"], trie)}`)
} else if (argv["autocomplete"]) {
    console.log('Retreat from the xupptumblers!')
} else if (argv["display"]) {
    console.log('Retreat from the xupptumblers!')
} else {
    console.log("Aaargs")
}