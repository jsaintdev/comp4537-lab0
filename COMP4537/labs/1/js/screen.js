// Base Screen class for UI components
class Screen {
    constructor(title) {
        this.title = title;
    }

    setTitle() {
        const titleElement = document.getElementById('mainTitle');
        if (titleElement) {
            titleElement.textContent = this.title;
        }
    }

    setMainContent(contentHTML) {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = contentHTML;
        }
    }

    setFooter(footerHTML) {
        const footerElement = document.querySelector('footer');
        if (!footerElement && footerHTML) {
            const footer = document.createElement('footer');
            footer.innerHTML = footerHTML;
            document.body.appendChild(footer);
        } else if (footerElement) {
            footerElement.innerHTML = footerHTML;
        }
    }
}

// Index Screen class derived from Screen
class IndexScreen extends Screen {
    constructor() {
        super(messages.index.maintitle);
    }

    initialize() {
        this.setTitle();
        this.setMainContent(`
            <button id="writeButton">${messages.index.writeButton}</button>
            <button id="readButton">${messages.index.readButton}</button>
        `);

            // Add event listeners for buttons
    document.getElementById('writeButton').addEventListener('click', () => {
        window.location.href = 'writer.html';
    });

    document.getElementById('readButton').addEventListener('click', () => {
        window.location.href = 'reader.html';
    });
    }
}

// ReaderScreen class derived from Screen
class ReaderScreen extends Screen {
    constructor() {
        super(messages.reader.title);
    }

    initialize() {
        this.setTitle();
        this.setMainContent(`
            <div id="updatedMsg" class="top-right">${messages.reader.updatedMsg || ''}</div>
            <div id="notesContainer" class="notes-list"></div>
        `);
        this.setFooter(`
            <button id="backButton">${messages.reader.backButton}</button>
        `);

        this.loadNotes();
        this.setupEventListeners();
    }

    loadNotes() {
        const notesContainer = document.getElementById('notesContainer');
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes available.</p>';
        } else {
            notesContainer.innerHTML = notes.map((noteContent, index) => {
                const note = new Note(noteContent);
                return note.toHTML(index, messages.reader.backButton);
            }).join('');
        }

        const updatedMsg = document.getElementById('updatedMsg');
        updatedMsg.textContent = `${messages.reader.retrievedMsg || 'Last retrieved at:'} ${new Date().toLocaleString()}`;
    }

    setupEventListeners() {
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        } else {
            console.error('Back button not found in the DOM.');
        }
    }
}


// WriterScreen class derived from Screen
class WriterScreen extends Screen {
    constructor() {
        super(messages.writer.title);
    }

    initialize() {
        this.setTitle();
        this.setMainContent(`
            <div id="messageDisplay" class="top-right">${messages.writer.storedMsg || ''}</div>
            <div id="notesContainer" class="notes-list"></div>
            <button id="addButton">${messages.writer.addButton}</button>
        `);
        this.setFooter(`
            <button id="backButton">${messages.writer.backButton}</button>
        `);

        this.loadNotes();
        this.setupEventListeners();
    }

    loadNotes() {
        const notesContainer = document.getElementById('notesContainer');
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes available.</p>';
        } else {
            notesContainer.innerHTML = notes.map((noteContent, index) => {
                const note = new Note(noteContent);
                return note.toHTML(index, messages.writer.removeButton);
            }).join('');
        }
    }

    setupEventListeners() {
        // Handle Add Button
        const addButton = document.getElementById('addButton');
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.createNoteInput();
            });
        } else {
            console.error('Add button not found in the DOM.');
        }
    
        // Handle Remove Buttons in Notes Container
        const notesContainer = document.getElementById('notesContainer');
        if (notesContainer) {
            notesContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('removeButton')) {
                    const index = e.target.getAttribute('data-index');
                    const notes = JSON.parse(localStorage.getItem('notes')) || [];
                    notes.splice(index, 1);
                    localStorage.setItem('notes', JSON.stringify(notes));
                    this.loadNotes();
                }
            });
        } else {
            console.error('Notes container not found in the DOM.');
        }
    
        // Handle Back Button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        } else {
            console.error('Back button not found in the DOM.');
        }
    }

    createNoteInput() {
        const notesContainer = document.getElementById('notesContainer');
        const noteInputContainer = document.createElement('div');
        noteInputContainer.innerHTML = `
            <textarea id="noteInput" placeholder="Type your note here..."></textarea>
            <button id="saveButton">Save Note</button>
        `;

        notesContainer.appendChild(noteInputContainer);

        document.getElementById('saveButton').addEventListener('click', () => {
            const input = document.getElementById('noteInput').value;
            const messageDisplay = document.getElementById('messageDisplay');

            if (input.trim()) {
                const notes = JSON.parse(localStorage.getItem('notes')) || [];
                notes.push(input);
                localStorage.setItem('notes', JSON.stringify(notes));
                messageDisplay.textContent = `${messages.writer.storedMsg} ${new Date().toLocaleString()}`;
                this.loadNotes();
            } else {
                messageDisplay.textContent = 'Please enter a valid note.';
            }

            noteInputContainer.remove();
        });
    }
}
