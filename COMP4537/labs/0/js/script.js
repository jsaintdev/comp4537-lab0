// Reference: chatGPT was used while making this program

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
        this.shuffleTimer = null;

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

        // Disable card clicks
        this.deck.setCardsClickable(false);

        // Delay the game for a set period for "memorization" then start shuffling
        this.memorizationTimeout = setTimeout(() => {
            // Update the message to indicate shuffling phase
            this.showMessage(messages.shuffleMessage);

            // Shuffle the deck `userInput` number of times
            this.shuffles(this.userInput);
        }, this.userInput * 1000); // Delay based on user input
    }


    // Perform multiple shuffles with a delay
    shuffles(times) {
        let shuffleCount = 0;

        // Clear any existing timer before starting a new one
        if (this.shuffleTimer) {
            clearInterval(this.shuffleTimer);
            this.shuffleTimer = null;
        }

        // Perform the first shuffle immediately
        this.deck.shuffleDeck();
        shuffleCount++;

        // Start a new interval
        this.shuffleTimer = setInterval(() => {
            this.deck.shuffleDeck();
            shuffleCount++;

            if (shuffleCount >= times) {
                clearInterval(this.shuffleTimer);
                this.shuffleTimer = null;

                // Re-enable card clicks after shuffling
                this.deck.setCardsClickable(true);

                // Start the user interactive phase
                this.showMessage(messages.recallMessage);
                this.clickPhase();
            }
        }, 2000);
    }

    // User interactive phase where the user clicks the cards in the original order
    clickPhase() {
        let currentIndex = 0; // Index to track the user's progress
    
        // Enable card clicks
        this.deck.setCardsClickable(true);
    
        // Add click event listener to each card
        this.deck.cards.forEach((card) => {
            card.element.addEventListener("click", () => {
                if (currentIndex >= this.userInput) return; // Ignore clicks after game ends
    
                // Check if the clicked card is correct
                if (card.order === currentIndex) {
                    card.revealNumber("black"); // Correct guess in black
                    currentIndex++;
    
                    // Check if all cards are correctly clicked
                    if (currentIndex === this.userInput) {
                        this.showMessage(messages.successMessage);
                        this.startButton.textContent = messages.againButton;
                    }
                } else {
                    // Incorrect guess
                    card.revealNumber("red");
                    this.deck.revealAllNumbers("red");
                    this.showMessage(messages.failureMessage);
                    this.startButton.textContent = messages.againButton;
    
                    // Disable further clicks
                    this.deck.setCardsClickable(false);
                }
            });
        });
    }

    // Reset the game
    resetGame() {
        // Clear the game area and reset properties
        this.gameArea.innerHTML = "";
        this.deck = null;

        // Reset the Memorization timer
        if (this.memorizationTimeout) {
            clearTimeout(this.memorizationTimeout);
            this.memorizationTimeout = null;
        }

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

        // Assign unique values into the shuffledColors array
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
            // Reuse the existing element if it already exists
            if (!card.element) {
                card.element = card.render();
            }
    
            // Ensure numbers remain hidden
            if (card.element.textContent === "") {
                card.hideNumber(); // Ensure no number is displayed
            }
    
            gameArea.appendChild(card.element);
        });
    }

    // Shuffle the deck
    shuffleDeck() {
        // Hide card numbers
        this.cards.forEach((card) => card.hideNumber());

        // Shuffle and randomize positions
        const gameArea = document.getElementById("game-area");
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;
        const cardWidth = 160;
        const cardHeight = 80;

        const usedPositions = [];

        // Generate random positions for the cards and prevent overlap
        this.cards.forEach((card) => {
            let x, y, overlap;

            do {
                // Generate random x and y within bounds
                x = Math.random() * (areaWidth - cardWidth);
                y = Math.random() * (areaHeight - cardHeight);

                // Check for overlap
                overlap = usedPositions.some(([ux, uy]) =>
                    Math.abs(x - ux) < cardWidth / 2 && Math.abs(y - uy) < cardHeight / 2
                );
            } while (overlap);

            usedPositions.push([x, y]);
            card.setPosition(x, y);
        });

        // Render shuffled deck
        this.renderDeck(gameArea);
    }

    // Make cards clickable again after shuffling
    setCardsClickable(clickable) {
        this.cards.forEach((card) => {
            if (clickable) {
                card.element.style.pointerEvents = "auto";
            } else {
                card.element.style.pointerEvents = "none";
            }
        });
    }

    // Reveal the card order in red on an incorrect click
    revealAllNumbers(color = "red") {
        this.cards.forEach((card) => card.revealNumber(color));
    }
}

class Card {
    constructor(color, order) {
        this.color = color;
        this.order = order;
        this.element = null;
    }

    // Render the card as a DOM element
    render() {
        if (!this.element) {
            this.element = document.createElement("div");
            this.element.classList.add("card", this.color.toLowerCase());

                        // Create a span for the number
                        const numberSpan = document.createElement("span");
                        numberSpan.classList.add("card-number");
                        numberSpan.textContent = this.order + 1; // Display card number
                        this.element.appendChild(numberSpan);
        }
        this.element.dataset.order = this.order;
        this.element.style.backgroundColor = this.color;
        return this.element;
    }

    // Hides the numbers once the deck starts shuffling
    hideNumber() {
        if (this.element) {
            const numberSpan = this.element.querySelector(".card-number");
            if (numberSpan) numberSpan.textContent = "";
        }
    }

    // Update the card's order property after shuffling
    setPosition(x, y) {
        if (this.element) {
            this.element.style.position = "absolute";
            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
        }
    }

    // Shows the card number on a correct click
    revealNumber(color = "black") {
        if (this.element) {
            const numberSpan = this.element.querySelector(".card-number");
            if (numberSpan) {
                numberSpan.textContent = this.order + 1; // Show the original number
                numberSpan.style.color = color; // Set the color
            }
        }
    }
}

// Initialize the game when the script loads
window.onload = () => {
    const game = new Game();
};