const http = require("http");               // 'http' module for creating an HTTP server
const fs = require("fs");                   // 'file system' module for reading and serving files
const path = require("path");               // 'path' module for working with directory paths
const url = require("url");                 // 'url' module for parsing URL requests

const dt = require("./modules/utils");      // custom module containing helper functions
const messages = require("./lang/messages/en.js"); // Import localization messages

let port = 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Log incoming requests
    console.log("The server received a request:", req.url);

    // Parse the incoming URL request
    const parsedUrl = url.parse(req.url, true);
    // Extract the pathname from the URL
    const pathname = parsedUrl.pathname;
    // Extract query string
    const query = parsedUrl.query;
    
    // Log Query string
    console.log("Received query string:", query);

    // If the main page is requested
    if (pathname === "/COMP4537/labs/3/getDate/") {

        // If query contains a name, use it. Otherwise use "guest"
        let name;
        if (query.name) {
            name = String(query.name);
        } else {
            name = messages.guest;
        }

        // Extract the current time
        const currentTime = dt.getDate();
    
        // Construct the message
        const responseMessage = `<p style="color:blue;">${messages.greeting.replace("%name%", name)} ${currentTime}</p>`;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(responseMessage);
    } 
    else 
    {
        // Handle 404 for unknown routes
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
