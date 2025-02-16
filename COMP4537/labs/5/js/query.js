const endpoint = "https://lab5-ddivpeg3r-oceaans-projects.vercel.app";

// Triggers when "Insert" button is pressed
async function defaultPOST() {
    try {
        const response = await fetch(endpoint + "/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: [{
                        name: "Sara Brown",
                        date: "1901-01-01"
                    },
                    {
                        name: "John Smith",
                        date: "1941-01-01"
                    },
                    {
                        name: "Jack Ma",
                        date: "1961-01-30"
                    },
                    {
                        name: "Elon Musk",
                        date: "1999-01-01"
                    }
                ]
            })
        });

        const result = await response.json();
        if (response.ok) {
            displayMessage(messages.response.post);
        } else {
            displayMessage(messages.error.post + ": " + result.error);
        }

    } catch (err) {

        displayMessage(messages.error.post);
    }
}

// Verifies if the input from the text box is a valid POST or GET request
async function processQuery() {
    const input = document.getElementById("customquery").value.trim();

    // Checks if the text box is empty
    if (!input) {
        displayMessage(messages.error.empty);
        return;
    }

    // used ChatGPT to help with the if/else conditions
    if (/^INSERT/i.test(input)) {
        await customPOST(input);
    } else if (/^SELECT/i.test(input)) {
        await customGET(input);
    } else {
        displayMessage(messages.error.invalid);
    }
}

// Sends a valid POST request to /query for user-submitted INSERT queries
async function customPOST(sqlQuery) {
    try {
        const response = await fetch(endpoint + "/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sql: sqlQuery })
        });

        const result = await response.json();
        if (response.ok) {
            displayMessage(messages.response.post);
        } else {
            displayMessage(messages.error.post + ": " + result.error);
        }
    } catch (err) {
        displayMessage(messages.error.post + ": " + err.message);
    }
}

// Sends a valid GET request to /query for user-submitted SELECT queries
async function customGET(sqlQuery) {
    try {
        const response = await fetch(`${endpoint}/query?sql=${encodeURIComponent(sqlQuery)}`, {
            method: "GET"
        });

        const result = await response.json();
        if (response.ok) {
            displayMessage(messages.response.get + ": " + JSON.stringify(result));
        } else {
            displayMessage(messages.error.get + ": " + result.error);
        }
    } catch (err) {
        displayMessage(messages.error.get + ": " + err.message);
    }
}

// Helper function to update the display message
function displayMessage(newMessage) {
    const message = document.getElementById("userMessage");
    message.textContent = newMessage;
}