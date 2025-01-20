// 
class Note {
    // Constructor initializes the note with content and sets up a change notification callback
    constructor(content = "") {
        this.content = content; // The content of the note
        this.onContentChange = null; // Callback to notify when content changes
    }

    // Updates the content of the note and triggers the change notification if a callback is set
    setContent(newContent) {
        this.content = newContent;
        if (this.onContentChange) {
            this.onContentChange(newContent); // Notify observers about the change
        }
    }

    // Retrieves the current content of the note
    getContent() {
        return this.content;
    }

    toHTML(index, removeButtonText, onEdit) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note-item');
        noteElement.setAttribute('data-index', index); // Assign data-index for easy identification
    
        const contentField = document.createElement('textarea');
        contentField.value = this.content;
    
        // On content edit
        contentField.addEventListener('input', (e) => {
            onEdit(index, e.target.value);
        });
    
        const removeButton = document.createElement('button');
        removeButton.textContent = removeButtonText;
        removeButton.addEventListener('click', () => {
            // Use the provided remove function
            const writerScreen = new WriterScreen(); // Ensure you can call removeNoteAtIndex
            writerScreen.removeNoteAtIndex(index);
        });
    
        noteElement.appendChild(contentField);
        noteElement.appendChild(removeButton);
    
        return noteElement;
    }
    
    
    
    
     
}
