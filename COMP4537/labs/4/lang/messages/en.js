const messages = {
    request: {
        request: "Request # ",
        recorded: "New entry recorded:",
        entry: "%word% : %definition%"
    },

    exists: "Warning! %word% already exists",

    errors: {
        badrequest: "Error 400: The server could not process the request",
        wordNotFound: "Error 404: The requesed word %word% was not found",
        pageNotFound: "Error 404: The requested page does not exist",
        serverError: "Error 500: Internal Server Error"
    }
};

module.exports = messages;