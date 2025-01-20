class Note {
    constructor(content) {
        this.content = content;
    }

    toHTML(index, removeButtonLabel) {
        return `
            <div class="note-item" style="display: flex; justify-content: space-between; align-items: center;">
                <p style="margin: 0;">${this.content}</p>
                ${removeButtonLabel ? `<button class="removeButton" data-index="${index}">${removeButtonLabel}</button>` : ''}
            </div>
        `;
    }
}