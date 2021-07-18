interface Trie {
  [key: string]: any // eslint-disable-line
}

/**
 * Recursively returns a copy of the trie with the string provided added to it
 * @param {string} str
 * @param {Trie} map
 * @return {Trie}
 */
export function add(str: string, map: Trie): Trie {
  if (str.length == 0) {
    map["self"] = true;
    return map;
  } else {
    if (map[str.substring(0, 1)]) {
      map[str.substring(0, 1)] = add(
          str.substring(1), map[str.substring(0, 1)]
      );
      return map;
    } else {
      map[str.substring(0, 1)] = add(str.substring(1), {});
      return map;
    }
  }
}

/**
 * Recursively checks if a string exists in a trie.
 * @param {string} str
 * @param {Trie} map
 * @return {boolean}
 */
export function exists(str: string, map: Trie): boolean {
  if (str.length == 0) {
    if (map["self"]) {
      return true;
    } else {
      return false;
    }
  } else {
    if (map[str.substring(0, 1)]) {
      return exists(str.substring(1), map[str.substring(0, 1)]);
    } else {
      return false;
    }
  }
}

/**
 * Recursively created a trie without the specified string
 * @param {string} str
 * @param {Trie} map
 * @return {boolean}
 */
export function remove(str: string, map: Trie): Trie {
  if (str.length == 0) {
    if (map["self"]) {
      delete map["self"];
      return map;
    }

    return map;
  } else {
    if (map[str.substring(0, 1)]) {
      const next = remove(str.substring(1), map[str.substring(0, 1)]);

      if (Object.keys(next).length == 0) {
        delete map[str.substring(0, 1)];
      } else {
        map[str.substring(0, 1)] = next;
      }
    }

    return map;
  }
}

/**
 * Returns array of words in a trie
 * @param {Trie} map
 * @return {string[]}
 */
export function display(map: Trie): string[] {
  let words: string[] = []; // eslint-disable-line

  displayHelper("", map, words);

  return words;
}

/**
 * Display helper function that recursively adds strings to words array
 *  @param {string} str
 *  @param {Trie} map
 *  @param {string[]} words
 */
function displayHelper(str: string, map: Trie, words: string[]) {
  if (map["self"]) {
    words.push(str);
  }

  Object.keys(map).forEach((key) => {
    if (key !== "self") {
      displayHelper(str + key, map[key], words);
    }
  });
}

/**
 * Returns words in a trie that start with the specified string
 *  @param {string} str
 *  @param {Trie} map
 *  @return {string[]}
 */
export function autocomplete(str: string, map: Trie): string[] {
  let newMap: Trie = {...map};
  for (let i = 0; i < str.length; i++) {
    newMap = newMap[str.charAt(i)];
  }

  let words: string[] = []; // eslint-disable-line

  displayHelper(str, newMap, words);

  return words;
}

