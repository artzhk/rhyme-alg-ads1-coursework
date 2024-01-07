const fs = require('fs');

const loadTxt = (path) => { 
    return fs.readFileSync(path).toString().split("\n"); 
}

const wordsSet = loadTxt("assets/wordlist.txt");

//helper functions
// checks whether string contains substring 
function containsSubstring(substring, string) {
    // if some of them are empty or undefined return false
    if (!substring || !string) {
        return false;
    }
    let j = 0;
    let i = 0;
    let count = 0;
    // count matching character 
    while (i < string.length) {
        if (string[i] == substring[0]) {
            count = 0;
            while (j < substring.length) {
                if (string[i + j] == substring[j]) {
                    count++;
                }

                j++;
            }
        }

        i++;
    }

    return substring.length == count;
}

// checks whether string contains char
function containsChar(char, string) {
    let i = 0;
    while (i <= string.length) {
        if (char == string[i]) {
            return true;
        }

        i++;
    }

    return false;
}

// Rhymes algorithm functions
// checks whether string two endings pronounce in similar way 
function samePronunciation(string1, string2) {
    let i = string1.length - 1;
    let j = string2.length - 1;
    let string1CompoundSound = false;
    let string2CompoundSound = false;

    const compoundSound = { k: "ck", i: "ee", e: "ee", g: "ck", a: "ea", p: "ck", e: "ea"};
    //divide current compound sound set 
    //into few set with different variations of e a k and so on

    if (i != j) {
        let sounds = [];
        while (i >= 0 || j >= 0) {
            string1CompoundSound = containsSubstring(compoundSound[string2[j]], string1);
            string2CompoundSound = containsSubstring(compoundSound[string1[i]], string2);

            if (string1CompoundSound) {
                sounds.push(string1CompoundSound);
            }

            if (string2CompoundSound) {
                sounds.push(string2CompoundSound);
            }

            i--;
            j--;
        }

        if (sounds.length == 0) {
            return false;
        }
    }

    i = string1.length - 1;
    j = string2.length - 1;

    const assonantLetters = { a: "e", k: "c", s: "c", g: "k", p: "k" , d: "t", t: "p"};
    let assonantLettersInStrings = false;

    while (i >= 0 && j >= 0) {
        assonantLettersInStrings = assonantLetters[string1[i]] == string2[j] || string1[i] == assonantLetters[string2[j]];
        string1CompoundSound = containsSubstring(compoundSound[string2[j]], string1);
        string2CompoundSound = containsSubstring(compoundSound[string1[i]], string2);

        if (string1CompoundSound && string2CompoundSound) { 
            i -= 2;
            j -= 2;
        } else if (string1CompoundSound) {
            i -= 2;
            j--;
        } else if (string2CompoundSound) {
            j -= 2;
            i--;
        } else if (assonantLettersInStrings || string1[i] == string2[j]) {
            i--;
            j--;
        } else {
            return false;
        }
    }

    return true;
}

/*
 * Obtain an ending of a certain word
 */
function getEnding(word) {
    if (word.length == 2) {
        return [word[0], word[1]];
    }

    const ending = [];
    const vowels = ["a", "e", "o", "u", "i"];
    //starting loop with length of 4 chars from the tail of word array.
    for (let i = word.length - 1; i > word.length - 5 && i > 0; i--) {
        //check whether current element not last and not the first one.
        if (i < word.length - 1 && i > word.length - 4) {
            //check whether current element is a vowel and element after(going from right to left) isn't vowel.
            if (!containsChar(word[i - 1], vowels) && containsChar(word[i], vowels)) {
                // add element to the que and stop algorithm.
                ending.unshift(word[i]);
                break;
            }
        }
        // otherwise add an element to the result.
        ending.unshift(word[i]);
    }

    return ending;
}

/*
 * Assemble algorithm is responsible for obtain a
 * word ending and compare it with ending of other words
 */
function getRhymes(word, wordsSet) {
    const ending = getEnding(word.trim());
    console.log(ending)
    const rhymes = [];
    // going over a set of words
    for (let i = 0; i < wordsSet.length; i++) {
        //taking end of the certain word
        const wordEnding = getEnding(wordsSet[i]);
        //checking equality
        //console.log(ending, wordEnding)
        if (samePronunciation(ending, wordEnding)) {
            //adding element to the result;
            rhymes.push(wordsSet[i]);
        }
    }

    return rhymes;
}

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question("Enter a word: \n", word => {
    console.log("Result: \n", getRhymes(word, wordsSet));
    readline.close();
});

