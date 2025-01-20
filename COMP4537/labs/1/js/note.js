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

    toHTML(index, removeButtonLabel, onContentChange) {
        const container = document.createElement('div');
        container.classList.add('note-item');
        container.dataset.index = index; // Unique index for targeting
    
        // Input element for editing note content
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.content;
        input.dataset.index = index; // Assign the same index
        input.addEventListener('input', (e) => {
            this.setContent(e.target.value);
            if (onContentChange) onContentChange(index, e.target.value);
        });
        container.appendChild(input);
    
        // Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = removeButtonLabel;
        removeButton.dataset.index = index; // Assign the same index
        removeButton.addEventListener('click', () => {
            onContentChange(index); // Trigger the removal logic
        });
        container.appendChild(removeButton);
    
        return container; // Return the full container
    }
    
    
    
     
}
