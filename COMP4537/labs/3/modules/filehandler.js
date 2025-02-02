const fs = require("fs");
const path = require("path");
const ErrorHandler = require("./errorhandler.js");

class FileHandler {
    constructor(filename) {
        this.filePath = path.join(__dirname, "..", filename);
    }

    // Append text to the file (or create it if it doesn't exist)
    appendToFile(text) {
        return new Promise((resolve, reject) => {
            fs.appendFile(this.filePath, "\n" + text, (err) => {
                if (err) {
                    console.error(`[ERROR] Failed to write to file: ${this.filePath}`, err);
                    reject(err);
                } else {
                    console.log(`[INFO] Successfully appended to file: ${this.filePath}`);
                    resolve();
                }
            });
        });
    }

    // Read entire file content (return 404 if missing)
    readFromFile() {
        return new Promise((resolve, reject) => {
            fs.access(this.filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(`[ERROR] File not found: ${this.filePath}`);
                    reject(err);
                } else {
                    fs.readFile(this.filePath, "utf8", (err, data) => {
                        if (err) {
                            console.error(`[ERROR] Failed to read file: ${this.filePath}`, err);
                            reject(err);
                        } else {
                            console.log(`[INFO] Successfully read file: ${this.filePath}`);
                            resolve(data);
                        }
                    });
                }
            });
        });
    }
}

module.exports = FileHandler;
