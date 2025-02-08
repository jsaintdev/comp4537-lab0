// Imports
const http = require("http");
const url = require("url");

// Modules and messages
const dct = require("./modules/dictionary.js");
const messages = require("./lang/messages/en.js");

// Variables
let port = 3000;
const GET = 'GET';
const POST = 'POST';
const endPointRoot = "/API/definitions/"
const serverDictionary = new dct;

// HTTP server
const server = http.createServer((req, res) => {

    // *** CHANGE TO SERVER 1 ***
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*"
    });

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

        res.setHeader("Content-Type", "application/json");

        // Parse the incoming URL
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;


    }
});

// Start server listener
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});