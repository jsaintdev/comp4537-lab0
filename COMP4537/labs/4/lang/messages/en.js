const messages = {
    request: {
        recorded: "Request # %request%  New entry recorded: %word% : %definition%",
        exists: "Request # %request%: word %word% already exists",
        notFound: "Request # %request%: word %word% not found",
    },

    errors: {
        badrequest: "Error 400: The request is invalid",
        serverError: "Error 500: Internal Server Error"
    }
};

module.exports = messages;