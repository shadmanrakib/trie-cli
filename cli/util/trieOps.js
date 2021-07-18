const axios = require('axios')

function display(functionsBaseURL) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/displayTrie`)
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
              reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
} 

function add(functionsBaseURL, word) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/addWord`, {
            params: {
              word: word
            }
          })
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
                reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
} 

function del(functionsBaseURL, word) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/deleteWord`, {
            params: {
              word: word
            }
          })
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
                reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
} 

function search(functionsBaseURL, word) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/searchWord`, {
            params: {
              word: word
            }
          })
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
                reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
} 

function autocomplete(functionsBaseURL, str) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/autocompleteSuggestions`, {
            params: {
              str: str
            }
          })
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
                reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
} 

function reset(functionsBaseURL) {
    return new Promise((resolve, reject) => {
        axios.get(`${functionsBaseURL}/resetTrie`)
          .then(function (response) {
            if(response.statusText && response.statusText == "OK") {
              if(response.data.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.data.message));
              }
            } else {
                reject(new Error("An error has occured."));
            }
          })
          .catch(function (error) {
            reject(error);
          })
    }); 
}

module.exports = {
    add: add,
    del: del,
    search: search,
    display: display,
    autocomplete: autocomplete,
    reset: reset
};