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
    
    // Subscribe to observer events
    observer.subscribe('noteSaved', () => {
        console.log('noteSaved event received in ReaderScreen');
        this.loadNotes(); // Reload on save
    });

    observer.subscribe('textChanged', (text) => {
        this.previewText(text);
    });
    }

    previewText(text) {
        const notesContainer = document.getElementById('notesContainer');
        if (notesContainer) {
            notesContainer.innerHTML = `
                <div class="note-item">
                    <p style="margin: 0;">${text}</p>
                </div>
            `;
        }
    }

    loadNotes() {
        const notesContainer = document.getElementById('notesContainer');
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
    
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes available.</p>';
        } else {
            notesContainer.innerHTML = notes.map((noteContent, index) => {
                const note = new Note(noteContent);
                // Pass a placeholder or an empty string if no button is required for notes
                return note.toHTML(index, '');
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
        this.inputContainer = null; // Track the input container
    }

    initialize() {
        this.setTitle();
        this.setMainContent(`
            <div id="messageDisplay" class="top-right">${messages.writer.storedMsg || ''}</div>
            <div id="notesContainer" class="notes-list"></div>
        `);
        this.setFooter([
            this.createButton(AddButton, this), // Initialize the Add button
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
                return `
                    <div class="note-container">
                        <p>${noteContent}</p>
                        <button class="removeButton" data-index="${index}">Remove</button>
                    </div>
                `;
            }).join('');
        }
    
        // Add event listeners to all remove buttons
        document.querySelectorAll('.removeButton').forEach((button) => {
            button.addEventListener('click', (event) => {
                const buttonIndex = parseInt(event.target.getAttribute('data-index'), 10);
                const notes = JSON.parse(localStorage.getItem('notes')) || [];
    
                // Remove the note from the array and update storage
                notes.splice(buttonIndex, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
    
                // Reload notes to reflect the changes
                this.loadNotes();
            });
        });
    }
    

    createNoteInput() {
        if (this.inputContainer) return;

        const notesContainer = document.getElementById('notesContainer');
        this.inputContainer = document.createElement('div');
        this.inputContainer.id = 'noteInputContainer';

        const textarea = document.createElement('textarea');
        textarea.id = 'noteInput';
        textarea.placeholder = 'Type your note here...';

        // Notify observers on text input
        textarea.addEventListener('input', () => {
            observer.notify('textChanged', textarea.value);
        });
        this.inputContainer.appendChild(textarea);

        const saveButton = this.createButton(SaveButton, this, this.inputContainer);
        this.inputContainer.appendChild(saveButton.render());

        notesContainer.appendChild(this.inputContainer);

        const addButton = document.getElementById('addButton');
        if (addButton) addButton.style.display = 'none';
    }
    
    removeNoteInput() {
        // Remove the input container
        if (this.inputContainer) {
            this.inputContainer.remove();
            this.inputContainer = null;
        }

        // Show the "Add" button again
        const addButton = document.getElementById('addButton');
        if (addButton) addButton.style.display = '';
    }
}


// Observer Class
class Observer {
    constructor() {
        this.events = {};
    }

    // Subscribe to an event
    subscribe(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        console.log(`Subscribed to event: ${event}`);
    }

    // Notify all subscribers of an event
    notify(event, data) {
        if (this.events[event]) {
            console.log(`Notifying event: ${event} with data:`, data);
            this.events[event].forEach((listener) => listener(data));
        } else {
            console.warn(`No subscribers for event: ${event}`);
        }
    }
}


// Singleton instance of Observer
const observer = new Observer();
