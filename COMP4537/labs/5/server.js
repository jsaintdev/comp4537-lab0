const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const BASE_DIR = path.join(__dirname, "COMP4537/labs/5");

const server = http.createServer((req, res) => {
    let reqPath = req.url.split("?")[0]; // Remove query params
    let filePath = path.join(BASE_DIR, reqPath);

    console.log(`Requested Path: ${reqPath}`);

    // Ensure directory requests serve index.html
    if (reqPath === "/" || reqPath === "/COMP4537/labs/5/") {
        filePath = path.join(BASE_DIR, "index.html");
    }

    // Ensure the file exists before serving
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
        }

        // Determine content type
        const ext = path.extname(filePath);
        let contentType = "text/html";
        if (ext === ".js") contentType = "application/javascript";
        else if (ext === ".json") contentType = "application/json";
        else if (ext === ".png") contentType = "image/png";

        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/COMP4537/labs/5/`);
});
