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
        const inputValue = parseInt(this.inputElement.value, 10);

        if (isNaN(inputValue) || inputValue < 3 || inputValue > 7) {
            this.showMessage(messages.invalidInput);
            return;
        }

        this.userInput = inputValue;

        // Hides the input bar
        this.inputElement.style.display = "none";

        // Start the game
        this.startGame();
    }


    // Start the game
    startGame() {
        this.showMessage(messages.memorizeMessage);
        this.startButton.textContent = messages.resetButton;

        // Clears previous event listeners
        this.resetListeners();

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
        this.gameArea.innerHTML = "";
        this.inputElement.value = "";

        // Reset to the initial screen
        this.inputElement.style.display = "block";
        this.startButton.textContent = messages.startButton;
        
        this.resetListeners();
        this.showMessage(messages.startMessage);
        this.deck = null;
    }

    resetListeners() {
        this.startButton.removeEventListener("click", () => this.resetGame());
        this.startButton.addEventListener("click", () => this.handleStartButton());
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
        for (let i = 0; i < this.size; i++) {
            const color = this.colors[i % this.colors.length]; // Cycle through colors
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