// Button base class
class Button {
    constructor(label, id, onClick) {
        this.label = label;
        this.id = id;
        this.onClick = onClick;
    }

    render() {
        const button = document.createElement('button');
        button.textContent = this.label;
        button.id = this.id;
        button.addEventListener('click', this.onClick);
        return button;
    }
}

// WriteButton (Index only)
class WriteButton extends Button {
    constructor() {
        super(messages.index.writeButton, 'writeButton', () => {
            window.location.href = 'writer.html';
        });
    }
}

// ReadButton (Index only)
class ReadButton extends Button {
    constructor() {
        super(messages.index.readButton, 'readButton', () => {
            window.location.href = 'reader.html';
        });
    }
}

// AddButton (Writer only)
class AddButton extends Button {
    constructor(writerScreen) {
        super(messages.writer.addButton, 'addButton', () => {
            writerScreen.createNoteInput();
        });
    }
}


class SaveButton extends Button {
    constructor(writerScreen, noteInputContainer) {
        super('Save Note', 'saveButton', () => {
            const input = document.getElementById('noteInput').value;
            const messageDisplay = document.getElementById('messageDisplay');

            if (input.trim()) {
                const notes = JSON.parse(localStorage.getItem('notes')) || [];
                notes.push(input);
                localStorage.setItem('notes', JSON.stringify(notes));
                messageDisplay.textContent = `${messages.writer.storedMsg} ${new Date().toLocaleString()}`;
                writerScreen.loadNotes();

                // Notify observers about the saved notes
                observer.notify('noteSaved', notes);
            } else {
                messageDisplay.textContent = 'Please enter a valid note.';
            }

            writerScreen.removeNoteInput();
        });
    }
}


class RemoveButton extends Button {
    constructor(index, writerScreen) {
        super(messages.writer.removeButton, `removeButton-${index}`, (event) => {
            // Dynamically fetch the index from the button's attribute
            const buttonIndex = parseInt(event.target.getAttribute('data-index'), 10);
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            
            // Log the current index and notes for debugging
            console.log('Removing note at index:', buttonIndex);
            console.log('Current notes:', notes);

            // Remove the note and update storage
            notes.splice(buttonIndex, 1);
            localStorage.setItem('notes', JSON.stringify(notes));

            // Reload the notes to reflect changes
            writerScreen.loadNotes();
        });
    }

    render(index) {
        const button = super.render();
        button.classList.add('removeButton');
        button.setAttribute('data-index', index); // Use the passed index directly
        return button;
    }    
}


// BackButton (Writer and Reader)
class BackButton extends Button {
    constructor() {
        super(messages.reader.backButton, 'backButton', () => {
            window.location.href = 'index.html';
        });
    }
}
