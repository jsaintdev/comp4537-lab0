class ErrorHandler {
    static send400(res, message) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(message);
    }

    static send404(res, message) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(message);
    }

    static send500(res, message) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(message);
    }
}

module.exports = ErrorHandler;
