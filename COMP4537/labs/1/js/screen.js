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

    setFooter(buttons) {
        let footerElement = document.querySelector('footer');
        if (!footerElement) {
            footerElement = document.createElement('footer');
            document.body.appendChild(footerElement);
        }

        footerElement.innerHTML = ''; // Clear existing content
        buttons.forEach((button) => {
            footerElement.appendChild(button.render());
        });
    }

    createButton(buttonClass, ...args) {
        return new buttonClass(...args);
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
            <div id="indexButtonsContainer"></div>
        `);

        const buttonsContainer = document.getElementById('indexButtonsContainer');

        const writeButton = this.createButton(WriteButton);
        const readButton = this.createButton(ReadButton);

        buttonsContainer.appendChild(writeButton.render());
        buttonsContainer.appendChild(readButton.render());
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
        this.setFooter([this.createButton(BackButton)]);

        this.loadNotes();
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
        `);
        this.setFooter([
            this.createButton(AddButton, this),
            this.createButton(BackButton)
        ]);

        this.loadNotes();
    }

    loadNotes() {
        const notesContainer = document.getElementById('notesContainer');
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes available.</p>';
        } else {
            notesContainer.innerHTML = notes.map((noteContent, index) => {
                const note = new Note(noteContent);
                return `${note.toHTML(index, messages.writer.removeButton)}`;
            }).join('');
        }
    }

    createNoteInput() {
        const notesContainer = document.getElementById('notesContainer');
        const noteInputContainer = document.createElement('div');

        const textarea = document.createElement('textarea');
        textarea.id = 'noteInput';
        textarea.placeholder = 'Type your note here...';
        noteInputContainer.appendChild(textarea);

        const saveButton = this.createButton(SaveButton, this, noteInputContainer);
        noteInputContainer.appendChild(saveButton.render());

        notesContainer.appendChild(noteInputContainer);
    }
}

