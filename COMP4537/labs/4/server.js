// Imports
const http = require("http");
const url = require("url");

// Modules and messages
const dct = require("./modules/dictionary.js");
const messages = require("./lang/messages/en.js");

// Variables
let port = 3000;
let counter = 0;
const GET = 'GET';
const POST = 'POST';
const endPointRoot = "/API/definitions/"
const serverDictionary = new dct;

// HTTP server
const server = http.createServer((req, res) => {

    // Increment Request counter
    counter++;

    // POST: adding a word to the dictionary
    if (req.method === POST) {
        console.log("The server received a POST request");

        res.setHeader("Content-Type", "text/html");

        // Return a message if it already exists

        // Otherwise, add the word and definition to the dictionary

        // Return success message
    }


    // GET: retrieve the definition of a word in JSON
    if (req.method === GET) {
        console.log("The server received a GET request:", req.url);

        // Parse the incoming URL
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        // Validate the URL
        if (pathname === endPointRoot && query.word) {
            // Check if word exists
            if (serverDictionary.checkWordExists(query.word)) {
                // If so, retrieve the entry
                let getdef = serverDictionary.getWord(query.word);
                // **TO DO** change to server 1 //
                res.writeHead(200, {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({ word: query.word, definition: getdef }));
            }
            // Else return an error message
            else {
                console.log("The requested word does not exist")
                res.writeHead(404, {
                // **TO DO** change to server 1 //
                    "Access-Control-Allow-Origin": "*",
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