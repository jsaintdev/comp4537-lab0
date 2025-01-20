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

class ReaderScreen extends Screen {
    constructor() {
        super(messages.reader.title); // Set the title for the Reader screen
        this.notes = []; // Array to store notes from the Writer screen
    }

    initialize() {
        this.setTitle(); // Set the screen title
        this.setMainContent(`
            <div id="updatedMsg" class="top-right">${messages.reader.updatedMsg || ''}</div>
            <div id="notesContainer" class="notes-list"></div>
        `);
        this.setFooter([
            this.createButton(BackButton) // Back button to return to the index
        ]);

        this.loadNotesFromStorage(); // Load notes initially

        // Set up periodic updates for notes and the last updated time
        setInterval(() => {
            this.loadNotesFromStorage(); // Reload notes from storage

            // Update the last updated time
            const lastUpdated = new Date().toLocaleString();
            const updatedMsg = document.getElementById('updatedMsg');
            if (updatedMsg) {
                updatedMsg.textContent = `${messages.reader.retrievedMsg || 'Last retrieved at:'} ${lastUpdated}`;
            }

            // Save the last updated time in local storage
            localStorage.setItem('readerLastUpdated', lastUpdated);
        }, 2000);
    }

    loadNotesFromStorage() {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || []; // Retrieve notes from local storage
        this.notes = storedNotes; // Initialize the notes array
        this.displayNotes(); // Display the notes
    }

    displayNotes() {
        const notesContainer = document.getElementById('notesContainer');
        if (!notesContainer) {
            console.error('notesContainer element not found in the DOM');
            return;
        }

        // Clear the container before re-rendering
        notesContainer.innerHTML = '';

        if (this.notes.length === 0) {
            notesContainer.textContent = 'No notes available.'; // Display a placeholder if no notes exist
        } else {
            this.notes.forEach((content) => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-item');
                noteElement.textContent = content;
                notesContainer.appendChild(noteElement);
            });
        }
    }
}


// Updated WriterScreen class
class WriterScreen extends Screen {
    constructor() {
        super(messages.writer.title); // Set the title for the Writer screen
        this.notes = this.loadNotesFromStorage(); // Load notes from local storage
        this.subject = new Subject(); // Subject for the Observer pattern
    }

    initialize() {
        this.setTitle(); // Set the screen title
        this.setMainContent(`
            <div id="messageDisplay" class="top-right">${messages.writer.storedMsg || ''}</div>
            <div id="notesContainer" class="notes-list"></div>
        `);
    
        // Add the AddButton to the main content area
        const notesContainer = document.getElementById('notesContainer');
        const addButton = this.createButton(AddButton, this); // Create AddButton instance
        notesContainer.after(addButton.render()); // Add the button before the notes list
    
        // Add BackButton to the footer
        this.setFooter([
            this.createButton(BackButton) // Only the BackButton goes in the footer
        ]);
    
        this.renderNotes(); // Render all notes

        // Set up periodic updates for the "stored at" message
        setInterval(() => {
            const messageDisplay = document.getElementById('messageDisplay');
            if (messageDisplay) {
                const lastSaved = new Date().toLocaleString();
                messageDisplay.textContent = `${messages.writer.storedMsg || 'Last saved at:'} ${lastSaved}`;
                
                // Save the last saved time in local storage
                localStorage.setItem('writerLastSaved', lastSaved);
            }
        }, 2000);
    }

    loadNotesFromStorage() {
        const notes = JSON.parse(localStorage.getItem('notes')) || []; // Retrieve notes from local storage
        return notes.map(content => new Note(content)); // Convert stored strings back to Note objects
    }

    saveNotesToStorage() {
        const noteContents = this.notes.map(note => note.getContent()); // Extract content from notes
        localStorage.setItem('notes', JSON.stringify(noteContents)); // Save to local storage
    }

    addNote(content) {
        const notesContainer = document.getElementById('notesContainer');
        const note = new Note(content); // Create a new note instance

        // Set up content change notification
        note.onContentChange = () => {
            this.saveNotesToStorage(); // Save notes whenever content changes
            this.notifyReader(); // Notify readers when note content changes
        };

        // Add the note to the notes array
        this.notes.push(note);

        // Render the note
        const noteIndex = this.notes.length - 1;
        const noteHTML = note.toHTML(noteIndex, messages.writer.removeButton, (index, newContent) => {
            this.notes[index].setContent(newContent); // Update the note content
            this.saveNotesToStorage(); // Save updated notes
            this.notifyReader(); // Notify readers about the changes
        });

        // Append the note to the container
        notesContainer.appendChild(noteHTML);
        this.saveNotesToStorage(); // Save notes after adding
    }

    removeNoteAtIndex(index) {
        if (index >= 0 && index < this.notes.length) {
            // Remove the note from the array
            this.notes.splice(index, 1);
    
            // Save updated notes to local storage
            this.saveNotesToStorage();
    
            // Notify ReaderScreen to update its notes
            this.notifyReader();
    
            // Locate the parent container
            const notesContainer = document.getElementById('notesContainer');
    
            if (notesContainer) {
                // Remove the specific note's DOM element
                const noteElement = notesContainer.querySelector(`[data-index="${index}"]`);
                if (noteElement) {
                    noteElement.remove(); // Remove the note element from the DOM
                }
    
                // Re-render remaining notes to update indices
                this.renderNotes();
            } else {
                console.error('notesContainer element not found in the DOM');
            }
        } else {
            console.error(`Invalid index: ${index}. Unable to remove note.`);
        }
    }
    
    renderNotes() {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = ''; // Clear existing notes
    
        this.notes.forEach((note, index) => {
            const noteHTML = note.toHTML(
                index,
                messages.writer.removeButton,
                (i, newContent) => {
                    this.notes[i].setContent(newContent); // Update content on edit
                    this.saveNotesToStorage(); // Save changes to local storage
                    this.notifyReader(); // Notify readers
                }
            );
    
            notesContainer.appendChild(noteHTML); // Add note to the DOM
        });
    }
    
    createNoteInput() {
        this.addNote(''); // Add a new blank note
    }

    notifyReader() {
        this.subject.notifyObservers(this.notes.map((note) => note.getContent())); // Notify observers with updated note contents
    }
}




// Subject class for implementing the Observer pattern
class Subject {
    constructor() {
        this.observers = []; // Array to store observers
    }

    // Adds a new observer to the list
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Removes an observer from the list
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Notifies all observers with optional data
    notifyObservers(data) {
        this.observers.forEach(observer => {
            if (observer.update) {
                observer.update(data); // Call the update method on each observer
            }
        });
    }
}
