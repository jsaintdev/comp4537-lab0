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

class DefaultPOSTButton extends Button {
    constructor() {
        super(messages.index.insert, 'defaultPOSTButton', () => {
            defaultPOST();
        });
    }
}

class SubmitButton extends Button {
    constructor() {
        super(messages.index.submit, 'submitButton', () => {
            // To Do: submit button function
        });
    }
}