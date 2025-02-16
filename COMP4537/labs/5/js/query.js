const endpoint = "https://lab5-ddivpeg3r-oceaans-projects.vercel.app";

// Triggers when "Insert" button is pressed
function defaultPOST() {
    const xhttp = new XMLHttpRequest();

    const data = {
        data: [
            { name: "Sara Brown", date: "1901-01-01" },
            { name: "John Smith", date: "1941-01-01" },
            { name: "Jack Ma", date: "1961-01-30" },
            { name: "Elon Musk", date: "1999-01-01" }
        ]
    };

    xhttp.open("POST", `${endpoint}/posts`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                displayMessage(messages.response.post);
            } else {
                const error = JSON.parse(this.responseText).error;
                displayMessage(messages.error.post + ": " + error);
            }
        }
    };

    xhttp.send(JSON.stringify(data));
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
function customPOST(data) {
    const xhttp = new XMLHttpRequest();
    const params = new URLSearchParams();

    // Convert the data array to a URL-encoded string
    data.forEach(item => {
        params.append("name", item.name);
        params.append("date", item.date);
    });

    xhttp.open("POST", `${endpoint}/posts`, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const result = JSON.parse(this.responseText);
                displayMessage(messages.response.post + `: Successfully inserted ${result.rowsInserted} row(s).`);
            } else {
                const error = JSON.parse(this.responseText).error;
                displayMessage(messages.error.post + ": " + error);
            }
        }
    };

    xhttp.send(params.toString()); // ✅ Send data as URL-encoded string
}


// Sends a valid GET request to /query for user-submitted SELECT queries
async function customGET(sqlQuery) {
    try {
        // Convert SQL query to URL-encoded format
        const params = new URLSearchParams();
        params.append("sql", sqlQuery);

        const response = await fetch(`${endpoint}/query?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const result = await response.json();
        if (response.ok) {
            if (Array.isArray(result) && result.length > 0) {
                // Format results for display
                const formattedResults = result.map(row => `${row.id}: ${row.name}, ${row.date}`).join("<br>");
                displayMessage(messages.response.get + ":<br>" + formattedResults);
            } else {
                displayMessage(messages.response.get + ": No results found.");
            }
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
    message.innerHTML = newMessage;
}