// Reference: ChatGPT was used while making this program

// Main script to initialize the Index screen
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    const indexScreen = new IndexScreen();
    const readerScreen = new ReaderScreen();
    const writerScreen = new WriterScreen();

    writerScreen.subject.addObserver(readerScreen);

    if (page === 'index.html') {
        indexScreen.initialize();
    } else if (page === 'reader.html') {
        readerScreen.initialize();
    } else if (page === 'writer.html') {
        writerScreen.initialize();
    }
});
