class Library {
    constructor() {
        this.dictionary = new Map();
    }

    // Check if a word exists already
    checkWordExists(thatWord) {
        return this.dictionary.has(thatWord);
    }

    // Add a new word
    addWord(newWord, newDefinition) {
        this.dictionary.set(newWord, newDefinition);
    }

    // Retrieve an existing word definition
    getWord(thatWord) {
        return this.dictionary.get(thatWord);
    }

}

module.exports = Library;