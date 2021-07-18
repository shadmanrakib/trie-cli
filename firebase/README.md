# trie-cli

## CLI Installation

The cli requires nodejs. Please download nodejs You can download nodejs here: https://nodejs.org/en/download/. 

The cli is available on npm, which is downloaded by default when installing nodejs. In order to install the cli, run the following in your terminal:

```
npm install -g trie-cli
```

## CLI Usage

Usage: trie \<cmd> [args]
Command | Description | Aliases
--------|-------------|--------
**trie display** | Displays words in trie | print, dis, p
**trie add \<word>** | Adds word to the trie | a
**trie del \<word>** | Deletes word from trie | delete, remove, r
**trie autocomplete \<str>** | Suggests words in trie that start with str | suggest, c
**trie search \<word>** | Search if word exists in the trie |  exists, e
**trie reset** | Resets global trie |  

### display

**Usage:** trie display

**Aliases:** print, dis, p

The display command prints all words in the global trie.

**Example:**

```
trie display
```

The following are equivalent to `trie display`
```
trie print
trie dis
trie p
```

### add

**Usage:** trie add \<word>

**Aliases:** a

Adds word to the global trie.

**Example:**

To add the word *apple* to the global trie, use:

```
trie add apple
```

The following are equivalent to `trie add apple`:

```
trie a apple
```

### del

**Usage:** trie del \<word>

**Aliases:** delete, remove, r

Removes word from the global trie.

**Example:**

To remove the word *apple* to the global trie, use:

```
trie del apple
```

The following are equivalent to `trie del apple`:

```
trie delete apple
trie remove apple
trie r apple
```

### autocomplete

**Usage:** trie autocomplete \<str>


**Aliases:** suggest, c

The autocomplete command prints words in the trie that start with the specified string argument *str*.

For example, if the trie contains app, apple, applet, application.

**Example:**

If the trie contains *ap, app, apple, applet, application, ball, ballon,* and *cat*, `trie autocomplete app` will print *app,apple,applet,application* because they start with app.

To autocomplete the string *app*, use:

```
trie autocomplete app
```

The following are equivalent to `trie autocomplete app`:

```
trie suggest app
trie c app
```

### search

**Usage:** trie search \<word>

**Aliases:** exists, e

This command returns whether the *word* argument exists in the trie.

**Example:**

To search for the word *apple*, use:

```
trie search apple
```

The following are equivalent to `trie del apple`:

```
trie exists apple
trie e apple
```

### reset

**Usage:** trie reset

The reset command removes all words in the global trie.

**Example:**

If you want to make the trie empty, which is represented by an empty object {}, run:

```
trie reset
```


## Firebase Firestore

The trie is store as a JSON object (refered to as map on Firestore). It is located in the *global* document in the *tries* collection. 

The trie is represented as nested JSON objects with each key, except for the *self* key, representing a character. The *self* key is used to represent that the path of keys leading to it make a full word in the trie.

For example, a trie that contains *ape, app,* and *apps* would look lik
```JSON
{
    "a" : {
        "p": {
            "e" : {
                "self" : true
            },
            "p" : {
                "self" : true,
                "s" : {
                    "self": true
                }
            }
        }
    }
}
```

## Firebase Functions

The api endpoints that interact with Firestore are deployed using Firebase Functions on the Google Cloud Platform. I chose to use Firebase Functions because used Firebase Firestore. 

The functions have JSDOC comments. A JSDOC Documentation was generated, and is available in `firebase/functions/jsdoc_documentation`. Please view it for further documentation on the functions. 

### Endpoints

The functions are deployed at ***URL***

Endpoint | Params | Description
---------|--------|-------------
displayTrie | | Displays all words in trie
addWord | word (string) | Adds word to the global trie.
deleteWord | word (string) | Removes word from the global trie.
autocompleteSuggestions | str (string) | Suggests words in trie that start with str
searchWord | word (string) | Searchs if word exists in the trie
resetTrie | | Resets global trie

#### displayTrie
*URL:* URL/displayTrie

If the request is successfully executed, then a JSON object is returned that contains a *success* key and a *words* key. The success key should be set to true. The words key should be set to an array of strings.

For example, if the trie contains *an, ape, app,* and *apps*, the object returned would be:

```JSON
{
    "success" : true,
    "words" : ["an", "ape", "app", "apps"]
}

```

If there is an error, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

Example:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

#### addWord
*URL:* URL/addWord

*Parameter:* word (string)

If the word is successfully added, an object is returned with two keys. One key is success, which should be true, and the other key is trie and it is set to the updated trie.

For example, if *app* is added successfully, and the trie now contains *ape, app,* and *apps*, the object returned would be:

```JSON
{
    "success" : true,
    "trie" : {
        "a" : {
            "p": {
                "e" : {
                    "self" : true
                },
                "p" : {
                    "self" : true,
                    "s" : {
                        "self": true
                    }
                }
            }
        }
    }
}

```

If the word is not successfully added, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

For example, if *app* is not added successfully, and the error message is `Must provide word as a parameter`, then the following is returned:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

#### deleteWord
*URL:* URL/deleteWord

*Parameter:* word (string)

If the word is successfully removed, an object is returned with two keys. One key is success, which should be true, and the other key is trie and it is set to the updated trie.

For example, if *apple* is removed successfully, and the trie now contains *ape, app,* and *apps*, the object returned would be:

```JSON
{
    "success" : true,
    "trie" : {
        "a" : {
            "p": {
                "e" : {
                    "self" : true
                },
                "p" : {
                    "self" : true,
                    "s" : {
                        "self": true
                    }
                }
            }
        }
    }
}

```

If the word is not successfully removed, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

For example, if *apple* is not removed successfully, and the error message is `Must provide word as a parameter`, then the following is returned:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

#### autocompleteSuggestions
*URL:* URL/autocompleteSuggestions

*Parameter:* str (string)

If the request is successfully executed, then a JSON object is returned that contains a *success* key and a *words* key. The success key should be set to true. The words key should be set to an array of strings.

For example, if *ap* is the str parameter the trie contains *an, ape, app,* and *apps*, the object returned would be:

```JSON
{
    "success" : true,
    "words" : ["ape", "app", "apps"]
}

```

If there is an error, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

Example:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

#### searchWord
*URL:* URL/searchWord

*Parameter:* word (string)

If the request is successfully executed, then a JSON object is returned that contains a *success* key and an *exists* key. The success key should be set to true. The exists should be set to a boolean that indicates whether the word exists in the trie.

For example, if *app* is searched up and the trie contains *ape, app,* and *apps*, the object returned would be:

```JSON
{
    "success" : true,
    "exists" : true
}

```

If there is an error, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

Example:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

#### resetTrie
*URL:* URL/resetTrie

If the request is successfully executed, then a JSON object is returned that contains a *success* key and a *trie* key. The success key should be set to true. The trie key should be `{}`.

```JSON
{
    "success" : true,
    "trie" : {}
}

```

If there is an error, an object is returned with two keys. One key is success, which should be false, and the other key is message, and it describes why the error occured.

Example:


```JSON
{
    "success" : false,
    "message" : "Must provide word as a parameter"
}

```

## Testing

To run tests, go to the cli directory, and run:

```
npm test
```

## Plans

If I were to spend more time on this project I would:

* Use AWS Simple Queue Service to create a queue to handle requests. I chose not to do this yet because it sort of goes against the scalability purpose of serverless functions and because I don't have an AWS account (I don't have a credit card).

* Add more helpful error messages.

* Use integers instead of booleans for the "self" key in order to keep track of how many times the word exists in the trie. 

* Add a childrens key to each node except for the self key. Since storage is relatively cheap, it might sense to store the children strings so that autocompletion and display are constant time. However, this would require altering the childrens array every time there is an addition and deletion. So, this optimization makes sense if we are optimizing for read over write.
