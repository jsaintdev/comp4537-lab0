// Imports
const http = require("http");
const url = require("url");

// Modules and messages
const Library = require("./modules/library.js");
const messages = require("./lang/messages/en.js");

// Variables
let port = 3000;
let counter = 0;
const GET = 'GET';
const POST = 'POST';
const endPointRoot = "/COMP4537/labs/4/api/definitions/"
const library = new Library();

// HTTP server
const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "https://comp-4537-six.vercel.app");

    // Handle Preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }

    // Add a new word to the dictionary
    if (req.method === POST) {
        console.log("The server received a POST request");
        counter++;

        let body = "";
        // Start receiving data
        req.on("data", function (chunk) {
            if (chunk != null) {
                body += chunk;
            }
        });
        // 'End' gets called when the stream has ended
        req.on("end", function () {
            const newEntry = JSON.parse(body);

            // Make sure word and definition are not null, and that word is only letters
            if (newEntry.word.trim() === "" || newEntry.definition.trim() === "" || !/^[a-zA-Z]+$/.test(newEntry.word)) {
                res.writeHead(400, {
                    "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
                    "Content-Type": "text/plain"
                });
                res.end(messages.errors.badrequest);
            }
            // Return a message if it already exists
            else if (library.checkWordExists(newEntry.word)) {
                res.writeHead(400, {
                    "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
                    "Content-Type": "text/plain"
                });
                const messageExists = messages.request.exists.replace("%request%", counter).replace("%word%", newEntry.word);
                res.end(messageExists);
            } else {
                // Otherwise, add the word and definition to the dictionary
                library.addWord(newEntry.word, newEntry.definition);
                // Return success message
                res.writeHead(201, {
                    "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
                    "Content-Type": "text/plain"
                });
                const messageRecorded = messages.request.recorded.replace("%request%", counter).replace("%word%", newEntry.word).replace("%definition%", newEntry.definition);
                res.end(messageRecorded);               
            }
        });
    }

    // Retrieve requested word
    if (req.method === GET) {
        console.log("The server received a GET request:", req.url);
        counter++;

        // Parse the incoming URL
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        if (query.word) {
            console.log("Requested word: ", query.word);
            console.log("Pathname: ", pathname);
        }

        // // Validate the query
        // if (query.word.trim() === "" || !/^[a-zA-Z]+$/.test(query.word)) {
        //     res.writeHead(400, {
        //         "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
        //         "Content-Type": "text/plain"
        //     });
        //     res.end(messages.errors.badrequest);
        // }
        // Validate the URL
        else if (pathname === endPointRoot && query.word) {

            console.log ("Word Exists: ", library.checkWordExists(query.word));

            // Check if word exists
            if (library.checkWordExists(query.word)) {
                // If so, retrieve the entry
                let getdef = library.getWord(query.word);
                console.log("Definition retrieved:", getdef);
                res.writeHead(200, {
                    "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    word: query.word,
                    definition: getdef
                }));
                console.log("Response JSON:", JSON.stringify({ word: query.word, definition: getdef }));
            }
            // Else return an error message
            else {
                console.log("The requested word does not exist")
                res.writeHead(404, {
                    "Access-Control-Allow-Origin": "https://comp-4537-six.vercel.app",
                    "Content-Type": "text/html"
                });
                const messagenotFound = messages.request.notFound.replace("%request%", counter).replace("%word%", query.word);
                res.end(messagenotFound);
            }
        }
    }
});

// Start server listener
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});