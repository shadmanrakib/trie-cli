#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const axios = require('axios')

const functionsBaseURL = "http://localhost:5001/trie-88b16/us-central1";

require('yargs')
    .scriptName('trie')
    .usage('trie <cmd> [args]')
    .command(['display', 'print', 'dis', 'p'],
             'Display words in trie', 
             (argv) => {
              axios.get(`${functionsBaseURL}/displayTrie`, {
                params: {
                  word: argv.word
                }
              })
              .then(function (response) {
                if(response.statusText && response.statusText == "OK") {
                  if(response.data.success) {
                    console.log(`Trie: ${response.data.words}`);
                  } else {
                    console.log(`Error: ${response.data.message}`);
                  }
                } else {
                  console.log("An error has occured.");
                }
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .command(['add <word>', 'a'],
             'Add word to the trie',
             (yargs) => {
               yargs.positional('word', {
                 describe: 'The word you want to add to the trie',
                 type: 'string'
               });
             }, (argv) => {
              axios.get(`${functionsBaseURL}/addWord`, {
                params: {
                  word: argv.word
                }
              })
              .then(function (response) {
                if(response.statusText && response.statusText == "OK") {
                  if(response.data.success) {
                    console.log(`Added ${argv.word}`);
                  } else {
                    console.log(`Error: ${response.data.message}`);
                  }
                } else {
                  console.log("An error has occured.");
                }
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .command(['del <word>', 'delete', 'remove', 'r'],
             'Delete word from trie',
             (yargs) => {
               yargs.positional('word', {
                 describe: 'The word you want to delete from trie',
                 type: 'string'
               });
             }, (argv) => {
              axios.get(`${functionsBaseURL}/deleteWord`, {
                params: {
                  word: argv.word
                }
              })
                .then(function (response) {
                  if(response.statusText && response.statusText == "OK") {
                    if(response.data.success) {
                      console.log(`Deleted ${argv.word}`);
                    } else {
                      console.log(`Error: ${response.data.message}`);
                    }
                  } else {
                    console.log("An error has occured.");
                  }
                })
                .catch(function (error) {
                  console.log(error);
                })
             })
    .command(['autocomplete <str>', 'suggest', 'c'],
             'Suggests words in trie that start with str',
            (yargs) => {
              yargs.positional('str', {
                describe: 'The string you want autocompletion suggestions for',
                type: 'string'
              });
            }, 
             (argv) => {
              axios.get(`${functionsBaseURL}/autocompleteSuggestions`, {
                params: {
                  str: argv.str
                }
              })
              .then(function (response) {
                if(response.statusText && response.statusText == "OK") {
                  if(response.data.success) {
                    console.log(`Suggestions: ${response.data.words}`);
                  } else {
                    console.log(`Error: ${response.data.message}`);
                  }
                } else {
                  console.log("An error has occured.");
                }
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .command(['search <word>', 'exists', 'e'],
             'Search if a word exists in the trie',
             (yargs) => {
               yargs.positional('word', {
                 describe: 'The word that you want to check whether it exists in the trie',
                 type: 'string'
               });
             }, (argv) => {
              axios.get(`${functionsBaseURL}/searchWord`, {
                params: {
                  word: argv.word
                }
              })
              .then(function (response) {
                if(response.statusText && response.statusText == "OK") {
                  if(response.data.success) {
                    console.log(`Exists: ${response.data.exists}`);
                  } else {
                    console.log(`Error: ${response.data.message}`);
                  }
                } else {
                  console.log("An error has occured.");
                }
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .demandCommand()
    .help()
    .parse();