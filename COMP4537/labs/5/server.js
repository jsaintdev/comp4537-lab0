const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const BASE_DIR = path.join(__dirname, "COMP4537/labs/5");

const server = http.createServer((req, res) => {
    let filePath = path.join(BASE_DIR, req.url);
    if (req.url === "/" || req.url === "/COMP4537/labs/5/") {
        filePath = path.join(BASE_DIR, "index.html");
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        } else {
            const ext = path.extname(filePath);
            let contentType = "text/html";
            if (ext === ".js") contentType = "application/javascript";
            else if (ext === ".css") contentType = "text/css";

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/COMP4537/labs/5/`);
});
