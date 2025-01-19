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

// SaveButton (Writer only)
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
            } else {
                messageDisplay.textContent = 'Please enter a valid note.';
            }

            noteInputContainer.remove();
        });
    }
}

// RemoveButton (Writer only)
class RemoveButton extends Button {
    constructor(index, writerScreen) {
        super(messages.writer.removeButton, `removeButton-${index}`, () => {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            writerScreen.loadNotes();
        });
    }

    render() {
        const button = super.render();
        button.classList.add('removeButton');
        button.setAttribute('data-index', this.id.split('-')[1]);
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
