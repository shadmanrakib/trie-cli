// The Firebase Cloud Functions SDK
import * as functions from "firebase-functions";


import {add, remove, exists, display, autocomplete} from "./trieOps";

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";

admin.initializeApp();

/** Cloud function that adds word specified in request query to trie*/
export const addWord = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        const word = req.query.word;

        if (typeof word == "string") {
          const trieRef = admin.firestore().collection("tries").doc("global");
          const oldTrieSnapshot = await trieRef.get();
          const data = oldTrieSnapshot.data();

          let oldTrie = {};

          if (data && data.trie && typeof data.trie == "object") {
            oldTrie = data.trie;
          }

          const newTrie = add(word, oldTrie);
          await trieRef.set({trie: newTrie});
          res.json({success: true, trie: newTrie});
        } else {
          res.json({
            success: false,
            message: "Word must be a string.",
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
        const word = req.query.word;

        if (typeof word == "string") {
          const trieRef = admin.firestore().collection("tries").doc("global");
          const oldTrieSnapshot = await trieRef.get();
          const data = oldTrieSnapshot.data();

          if (data && data.trie && typeof data.trie == "object") {
            if (exists(word, data.trie)) {
              const newTrie = remove(word, data.trie);
              await trieRef.set({trie: newTrie});
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
              message: "Trie does not exist.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Word provided must be a string.",
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
        const word = req.query.word;

        if (typeof word == "string") {
          const trieRef = admin.firestore().collection("tries").doc("global");
          const oldTrieSnapshot = await trieRef.get();
          const data = oldTrieSnapshot.data();

          if (data && data.trie && typeof data.trie == "object") {
            res.json({success: true, exists: exists(word, data.trie)});
          } else {
            res.json({
              success: false,
              message: "Trie does not exist.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Word must be a string.",
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
        const trieRef = admin.firestore().collection("tries").doc("global");
        const trieSnapshot = await trieRef.get();
        const data = trieSnapshot.data();

        if (data && data.trie && typeof data.trie == "object") {
          res.json({success: true, words: display(data.trie)});
        } else {
          res.json({
            success: false,
            message: "Trie does not exist.",
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
 * Cloud function that returns list of words in trie that start with the
 * specified string
 */
export const autocompleteSuggestions = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        const str = req.query.str;

        if (typeof str == "string") {
          const trieRef = admin.firestore().collection("tries").doc("global");
          const trieSnapshot = await trieRef.get();
          const data = trieSnapshot.data();

          if (data && data.trie && typeof data.trie == "object") {
            const suggestions = autocomplete(str, data.trie);
            res.json({success: true, words: suggestions});
          } else {
            res.json({
              success: false,
              message: "Trie does not exist.",
            });
          }
        } else {
          res.json({
            success: false,
            message: "Parameter str must be a string.",
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

export const resetTrie = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
      try {
        const trieRef = admin.firestore().collection("tries").doc("global");
        await trieRef.set({trie: {}});

        res.json({success: true, trie: {}});
      } catch {
        res.json({
          success: false,
          message: "An error has occured. Check the cloud functions log for further details..", // eslint-disable-line
        });
      }
    }
);
