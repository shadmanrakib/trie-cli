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
      const oldTrieSnapshot = await admin.firestore().collection("tries").doc("global").get();
      const data = oldTrieSnapshot.data()

      let oldTrie = {};

      if (data && data.trie && typeof data.trie == "object") {
        oldTrie = data.trie;
      }

      const newTrie = add(word, oldTrie);
      await admin.firestore().collection("tries").doc("global").set({ trie: newTrie });
      res.json({ success: true, trie: newTrie });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "An error has occured. Check the cloud functions log for further details."});
  }
});

export const removeWord = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {
  try {
    const word = req.query.word;

    if (typeof word == "string") {
      const oldTrieSnapshot = await admin.firestore().collection("tries").doc("global").get();
      const data = oldTrieSnapshot.data()

      if (data && data.trie && typeof data.trie == "object" && exists(word, data.trie)) {
        const newTrie = remove(word, data.trie);
        await admin.firestore().collection("tries").doc("global").set({ trie: newTrie });
        res.json({ success: true, trie: newTrie });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch {
    res.json({ success: false });
  }
});

export const existsWord = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {

  try {
    const word = req.query.word;

    if (typeof word == "string") {
      const oldTrieSnapshot = await admin.firestore().collection("tries").doc("global").get();
      const data = oldTrieSnapshot.data()

      if (data && data.trie && typeof data.trie == "object") {
        res.json({ success: true, exists: exists(word, data.trie) });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch {
    res.json({ success: false });
  }
});

export const displayTrie = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {
  try {
    const trieSnapshot = await admin.firestore().collection("tries").doc("global").get();
    const data = trieSnapshot.data()

    if (data && data.trie && typeof data.trie == "object") {
      res.json({ success: true, words: display(data.trie) });
    } else {
      res.json({ success: false });
    }

  } catch {
    res.json({ success: false });
  }
});

export const autocompleteSuggestions = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {
  try {
    const str = req.query.str;

    if (typeof str == "string") {
      const trieSnapshot = await admin.firestore().collection("tries").doc("global").get();
      const data = trieSnapshot.data()

      if (data && data.trie && typeof data.trie == "object") {
        res.json({ success: true, words: autocomplete(str, data.trie) });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch {
    res.json({ success: false });
  }
});