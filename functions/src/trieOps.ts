interface Trie {
  [key: string]: any
}

export function add(str: string, map: Trie): Trie {
  if (str.length == 0) {
    map["self"] = true;
    return map;
  } else {
    if (map[str.substring(0, 1)]) {
      map[str.substring(0, 1)] = add(str.substring(1), map[str.substring(0, 1)]);
      return map;
    } else {
      map[str.substring(0, 1)] = add(str.substring(1), {});
      return map;
    }
  }
}

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

export function remove(str: string, map: Trie): Trie {

  if (str.length == 0) {
    if (map["self"]) {
      delete map["self"];
      return map;
    }

    console.log(map)
    return map
  } else {
    if (map[str.substring(0, 1)]) {
      const next = remove(str.substring(1), map[str.substring(0, 1)]);

      if (Object.keys(next).length == 0) {
        delete map[str.substring(0, 1)];
      } else {
        map[str.substring(0, 1)] = next;
      }
    }

    console.log(map)
    return map;
  }
}

export function display(map: Trie): string[] {
  let words: string[] = [];

  displayHelper('', map, words);

  return words;
}

function displayHelper(str: string, map: Trie, words: string[]) {
  if (map["self"]) {
    words.push(str);
  }

  Object.keys(map).forEach(k => {
    if (k !== "self") {
      displayHelper(str + k, map[k], words);
    }
  });
}

export function autocomplete(str: string, map: Trie): string[] {
  let newMap: Trie = { ...map }
  for (let i = 0; i < str.length; i++) {
    newMap = newMap[str.charAt(i)];
  }

  let words: string[] = [];

  displayHelper(str, newMap, words);

  return words;
}

