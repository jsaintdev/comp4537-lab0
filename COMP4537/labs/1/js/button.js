// Updated Button classes

// Base Button class
class Button {
    constructor(label, id, onClick) {
        this.label = label; // Button label text
        this.id = id; // Button ID for DOM reference
        this.onClick = onClick; // Click event handler
    }

    render() {
        const button = document.createElement('button'); // Create button element
        button.textContent = this.label; // Set button label
        button.id = this.id; // Assign button ID
        button.addEventListener('click', this.onClick); // Attach click event handler
        return button; // Return the button element
    }
}

// WriteButton (Index screen)
class WriteButton extends Button {
    constructor() {
        super(messages.index.writeButton, 'writeButton', () => {
            window.location.href = 'writer.html'; // Navigate to the Writer screen
        });
    }
}

// ReadButton (Index screen)
class ReadButton extends Button {
    constructor() {
        super(messages.index.readButton, 'readButton', () => {
            window.location.href = 'reader.html'; // Navigate to the Reader screen
        });
    }
}

// AddButton (Writer screen)
class AddButton extends Button {
    constructor(writerScreen) {
        super(messages.writer.addButton, 'addButton', () => {
            writerScreen.createNoteInput(); // Trigger note creation
        });
    }
}

// RemoveButton updated for correct integration
class RemoveButton extends Button {
    constructor(index, writerScreen) {
        super(messages.writer.removeButton, `removeButton-${index}`, () => {
            writerScreen.removeNoteAtIndex(index); // Call remove method in WriterScreen
        });
    }

    render(index) {
        const button = super.render(); // Render the base button
        button.dataset.index = index; // Assign the note index as a data attribute
        return button; // Return the button element
    }
}

// BackButton (For navigation back to Index)
class BackButton extends Button {
    constructor() {
        super(messages.reader.backButton, 'backButton', () => {
            window.location.href = 'index.html'; // Navigate back to Index
        });
    }
}
