class Game {
    constructor() {
        // UI elements
        this.messageElement = document.getElementById("message");
        this.inputElement = document.getElementById("user-input");
        this.startButton = document.getElementById("start-button");
        this.gameArea = document.getElementById("game-area");

        // Properties
        this.userInput = 0;
        this.deck = null;

        // Bind methods to ensure proper scope
        this.handleStartButton = this.handleStartButton.bind(this);
        this.resetGame = this.resetGame.bind(this);

        // Event listener for start/reset button
        this.startButton.addEventListener("click", () => this.handleStartButton());

        // Load initial UI state
        this.initializeUI();
    }

    // Initialize the UI with localized strings
    initializeUI() {
        this.messageElement.textContent = messages.startMessage;
        this.startButton.textContent = messages.startButton;
        this.inputElement.placeholder = messages.inputPlaceholder;
    }

    // Handle the start/reset button click
    handleStartButton() {
        // Process user input
        const inputValue = parseInt(this.inputElement.value, 10);

        // Validate user input
        if (isNaN(inputValue) || inputValue < 3 || inputValue > 7) {
            this.showMessage(messages.invalidInput);
            return;
        }

        // Assign user input
        this.userInput = inputValue;

        // Hides the input bar
        this.inputElement.style.display = "none";

        // Change button to reset behavior
        this.startButton.removeEventListener("click", this.handleStartButton);
        this.startButton.addEventListener("click", this.resetGame);

        // Start the game
        this.startGame();

    }


    // Start the game
    startGame() {
        // Update the user-facing message and button
        this.showMessage(messages.memorizeMessage);
        this.startButton.textContent = messages.resetButton;

        // Create the deck
        this.deck = new Deck(this.userInput);
        this.deck.createDeck();
        this.deck.renderDeck(this.gameArea);

        // Start the memorization phase
        setTimeout(() => {
            this.deck.shuffleDeck();
            this.showMessage(messages.recallMessage);
        }, this.userInput * 1000); // Delay based on user input
    }

    // Reset the game
    resetGame() {
        // Clear the game area and reset properties
        this.gameArea.innerHTML = "";
        this.deck = null;

        // Call initializeUI to reset all UI elements to their initial state
        this.initializeUI();
        this.inputElement.style.display = "";

        // Reset event listeners
        this.startButton.removeEventListener("click", this.resetGame);
        this.startButton.addEventListener("click", this.handleStartButton);
    }

    // Display a message to the user
    showMessage(message) {
        this.messageElement.textContent = message;
    }
}

class Deck {
    constructor(size) {
        this.size = size; // Number of cards in the deck
        this.cards = []; // Array to hold Card objects
        this.colors = [
            "HoneyDew",
            "Lavender",
            "LavenderBlush",
            "LemonChiffon",
            "LightCyan",
            "PeachPuff",
            "SeaShell",
        ];
    }

    // Create the deck of cards
    createDeck() {
        // Create a copy of colors and shuffle it manually
        const availableColors = [...this.colors];
        const shuffledColors = [];

        while (shuffledColors.length < this.size) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            const color = availableColors.splice(randomIndex, 1)[0]; // Remove and get the color
            shuffledColors.push(color);
        }

        // Assign shuffled colors to cards
        for (let i = 0; i < this.size; i++) {
            const color = shuffledColors[i];
            const card = new Card(color, i);
            this.cards.push(card);
        }
    }

    // Render the deck to the game area
    renderDeck(gameArea) {
        gameArea.innerHTML = ""; // Clear the game area
        this.cards.forEach((card) => {
            gameArea.appendChild(card.render());
        });
    }

    // Shuffle the deck
    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        // Update card positions after shuffling
        this.cards.forEach((card, index) => {
            card.updateOrder(index);
        });
        this.renderDeck(document.getElementById("game-area"));
    }
}

class Card {
    constructor(color, order) {
        this.color = color; // Background color of the card
        this.order = order; // Initial order of the card
    }

    // Render the card as a DOM element
    render() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card", this.color.toLowerCase());
        cardElement.dataset.order = this.order;
        cardElement.style.backgroundColor = this.color;
        cardElement.textContent = this.order + 1; // Display the card number
        return cardElement;
    }

    // Update the card's order property after shuffling
    updateOrder(newOrder) {
        this.order = newOrder;
    }
}

// Initialize the game when the script loads
window.onload = () => {
    const game = new Game();
};