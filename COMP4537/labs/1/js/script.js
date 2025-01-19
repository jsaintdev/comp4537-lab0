// Reference: ChatGPT was used while making this program

// Main script to initialize the Index screen
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    if (page === 'index.html') {
        const indexScreen = new IndexScreen();
        indexScreen.initialize();
    } else if (page === 'reader.html') {
        const readerScreen = new ReaderScreen();
        readerScreen.initialize();
    } else if (page === 'writer.html') {
        const writerScreen = new WriterScreen();
        writerScreen.initialize();
    }
});
