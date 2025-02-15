// Helped by ChatGPT to understand the document. functions

document.addEventListener('DOMContentLoaded', () => {
    const insertButton = new DefaultPOSTButton().render();
    const submitButton = new SubmitButton().render();

    document.getElementById("defaultPOSTButton").replaceWith(insertButton);
    document.getElementById("submitButton").replaceWith(submitButton);
});