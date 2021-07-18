#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const {add, del, search, autocomplete, display, reset} = require('../util/trieOps')

const inDevelopment = true;

const functionsBaseURL = inDevelopment ? "http://localhost:5001/trie-88b16/us-central1" : "";

require('yargs')
    .scriptName('trie')
    .usage('trie <cmd> [args]')
    .command(['display', 'print', 'dis', 'p'],
             'Display words in trie', 
             (argv) => {
              display(functionsBaseURL, argv.word)
              .then(function (data) {
                console.log(`Trie: ${data.words}`);
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
              add(functionsBaseURL, argv.word)
              .then(function (data) {
                console.log(`Added ${argv.word}`);
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
              del(functionsBaseURL, argv.word)
                .then(function (data) {
                  console.log(`Deleted ${argv.word}`);
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
              autocomplete(functionsBaseURL, argv.str)
              .then(function (data) {
                console.log(`Suggestions: ${data.words}`);
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
              search(functionsBaseURL, argv.word)
              .then(function (data) {
                console.log(`Exists: ${data.exists}`);
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .command(['reset'],
             'Resets global trie',
             (argv) => {
              reset(functionsBaseURL, argv.word)
              .then(function (data) {
                console.log(`Reset completed.`);
              })
              .catch(function (error) {
                console.log(error);
              })
             })
    .demandCommand()
    .help()
    .parse();