const endpoint = "https://lab5-ddivpeg3r-oceaans-projects.vercel.app";

async function defaultPOST() {
    try {
        const response = await fetch(endpoint + "/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: [
                    { name: "Sara Brown", date: "1901-01-01" },
                    { name: "John Smith", date: "1941-01-01" },
                    { name: "Jack Ma", date: "1961-01-30" },
                    { name: "Elon Musk", date: "1999-01-01"}
                ]
            })
        });

        const result = await response.json();
        console.log("Default POST inserted successfully!");
    } catch (err) {
        console.log("Error inserting rows: " + err.message);
    }
}