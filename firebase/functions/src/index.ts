// The Firebase Cloud Functions SDK
import * as functions from "firebase-functions";

import {add, remove, exists, display, autocomplete} from "./trieOps";

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.database();

/** Cloud function that adds word specified in request query to trie*/
export const addWord = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        if (req.query && req.query.word) {
          const word = req.query.word;

          if (typeof word == "string") {
            const oldTrieSnapshot = await db.ref("trie").get();
            const data = oldTrieSnapshot.val();
            const oldTrie = data ? data : {};
            const newTrie = add(word, oldTrie);
            await db.ref("trie").set(newTrie);
            res.json({success: true, trie: newTrie});
          } else {
            res.json({
              success: false,
              message: "Word must be a string.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Must provide the parameter word",
          });
        }
      } catch (err) {
        console.log(err);
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details.", // eslint-disable-line
        });
      }
    }
);

/** Cloud function that removes word specified in request query to trie*/
export const deleteWord = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        if (req.query && req.query.word) {
          const word = req.query.word;

          if (typeof word == "string") {
            const oldTrieSnapshot = await db.ref("trie").get();
            const data = oldTrieSnapshot.val();
            const oldTrie = data ? data : {};

            if (exists(word, oldTrie)) {
              const newTrie = remove(word, oldTrie);
              await db.ref("trie").set(newTrie);
              res.json({success: true, trie: newTrie});
            } else {
              res.json({
                success: false,
                message: "Word does not exist in trie.",
              });
            }
          } else {
            res.json({
              success: false,
              message: "Word provided must be a string.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Must provide the parameter word",
          });
        }
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);


/** Cloud function that checks if word exists*/
export const searchWord = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        if (req.query && req.query.word) {
          const word = req.query.word;

          if (typeof word == "string") {
            const oldTrieSnapshot = await db.ref("trie").get();
            const data = oldTrieSnapshot.val();
            const oldTrie = data ? data : {};

            res.json({success: true, exists: exists(word, oldTrie)});
          } else {
            res.json({
              success: false,
              message: "Word must be a string.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Must provide the parameter word",
          });
        }
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);

/** Cloud function that returns list of words in trie*/
export const displayTrie = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        const oldTrieSnapshot = await db.ref("trie").get();
        const data = oldTrieSnapshot.val();
        const oldTrie = data ? data : {};

        res.json({success: true, words: display(oldTrie)});
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);


/**
 * Cloud function that returns list of words in trie that start with the
 * specified string
 */
export const autocompleteSuggestions = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        if (req.query && req.query.str) {
          const str = req.query.str;

          if (typeof str == "string") {
            const oldTrieSnapshot = await db.ref("trie").get();
            const data = oldTrieSnapshot.val();
            const trie = data ? data : {};

            const suggestions = autocomplete(str, trie);
            res.json({success: true, words: suggestions});
          } else {
            res.json({
              success: false,
              message: "Parameter str must be a string.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Must provide the parameter str",
          });
        }
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);

/**
 * Cloud function that resets the global trie
 */
export const resetTrie = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        await db.ref("trie").set({});
        res.json({success: true, trie: {}});
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);
