const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getDate } = require('./modules/utils');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathName === '/COMP4537/labs/3/getDate/') {
        const name = query.name || 'Guest';

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Greeting</title>
                <link rel="stylesheet" href="/COMP4537/labs/3/css/style.css">
            </head>
            <body>
                ${getDate(name)}
            </body>
            </html>
        `);
    } else if (pathName === '/COMP4537/labs/3/css/style.css') {
        fs.readFile(path.join(__dirname, 'css', 'style.css'), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(8080, () => {
    console.log('Server running on http://yourDomainName.xyz:8080');
});
