const http = require("http"); // 'http' module for creating an HTTP server
const fs = require("fs"); // 'file system' module for reading and serving files
const path = require("path"); // 'path' module for working with directory paths
const url = require("url"); // 'url' module for parsing URL requests

// Custom Modules
const dt = require("./modules/utils"); // get Date
const FileHandler = require("./modules/filehandler.js") // read/write to file
const ErrorHandler = require("./modules/errorhandler.js") // error handling

// Import localization messages
const messages = require("./lang/messages/en.js");

// Set up port and file handler
let port = 8080;
const fileHandler = new FileHandler("file.txt");

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

    // Part B -- Get Date
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

        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(responseMessage);
    }

    // Handle writing to a file (Part C.1)
    else if (pathname === "/COMP4537/labs/3/writeFile/") {
        if (!query.text) {
            ErrorHandler.send400(res, messages.errors.badrequest);
        } else {
            fileHandler.appendToFile(query.text)
                .then(() => {
                    res.writeHead(200, {
                        "Content-Type": "text/plain"
                    });
                    res.end(messages.writeSuccess);
                })
                .catch(() => {
                    ErrorHandler.send500(res, messages.errors.serverError);
                });
        }
    }

    // Handle reading from a file (Part C.2)
    else if (pathname.startsWith("/COMP4537/labs/3/readFile/")) {
        // Extract the requested filename
        const filename = pathname.replace("/COMP4537/labs/3/readFile/", "");
    
        // Validate that the filename is provided
        if (!filename) {
            return ErrorHandler.send400(res, messages.errors.badrequest);
        }
    
        // Create a file handler for the requested file
        const fileHandler = new FileHandler(filename);
    
        fileHandler.readFromFile()
            .then((content) => {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(content);
            })
            .catch(() => {
                ErrorHandler.send404(res, messages.errors.fileNotFound.replace("%filename%", filename));
            });
    }
    
    // Handle 404 for unknown routes
    else {
        ErrorHandler.send404(res, messages.errors.pageNotFound);
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});