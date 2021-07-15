function add(str, map) {
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

function exists(str, map) {
    if (str.length == 0) {
        if (map["self"]) {
            return true
        } else {
            return false
        }
    } else {
        if (map[str.substring(0, 1)]) {
            return exists(str.substring(1), map[str.substring(0, 1)]);
        } else {
            return false;
        }
    }
}

function remove(str, map) {
    if (str.length == 0) {
        if (map["self"]) {
            delete map["self"];
            return map;
        }

        return map
    } else {
        if (map[str.substring(0, 1)]) {
            next = remove(str.substring(1), map[str.substring(0, 1)]);

            if (next.length == 0) {
                delete map[str.substring(0, 1)];
            } else {
                map[str.substring(0, 1)] = next;
            }
        }

        return map;
    }
}

module.exports = {
    add: add,
    exists: exists,
    remove: remove
};