//used chatgpt to help with some functions
import { user } from '../lang/messages/en/user.js';

//Store all buttons created
let arrayButtons = [];

//Button class to create buttons
class Button{
    constructor(color, order) {
        this.order = order;
        this.btn = document.createElement("button");
        this.btn.className = "btn";
        this.btn.style.backgroundColor = color;
        this.btn.textContent = order;
        document.getElementById("button-container").appendChild(this.btn);
    }
}

//Shuffler class to shuffle buttons
class Shuffler {
    constructor(buttons){
        this.buttons = buttons;
        this.shuffleCount = 0;
        this.maxShuffles = buttons.length;
        this.intervalId = null;
        this.pauseLength = 2000; // milliseconds
        this.initialPause = buttons.length * 1000; // milliseconds
    }

    //Start shuffling buttons after a delay
    start(gameInstance){
        setTimeout(() => {
            this.intervalId = setInterval(() => {
                this.shuffle();
                this.shuffleCount++;
                if(this.shuffleCount >= this.maxShuffles){
                    this.stop();
                    this.buttons.forEach(button => {
                        button.btn.textContent = "";
                    });
                    gameInstance.start();
                }
            }, this.pauseLength);
        }, this.initialPause);
    }

    stop(){
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    //used ChatGPT to help with this function
    shuffle(){
        this.buttons.forEach(button => {
            const maxX = window.innerWidth - button.btn.offsetWidth;
            const maxY = window.innerHeight - button.btn.offsetHeight;
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            button.btn.style.position = "fixed";
            button.btn.style.left = randomX + "px";
            button.btn.style.top = randomY + 'px';
        });
    }
}

//Game class to handle game logic when shuffling is done
class Game{
    constructor(buttons){
        this.buttons = buttons;
        this.currentTarget = 1;
    }

    // Start the game
    start(){
        this.buttons.forEach(button => {
            button.btn.addEventListener('click', () => {this.handleClick(button)});
        });
    }

    // Handle button clicks
    handleClick(button){
        if(button.order === this.currentTarget){
            button.btn.textContent = button.order;
            this.currentTarget++;
            if(this.currentTarget > this.buttons.length){
                alert(user.WIN_MESSAGE);
                this.buttons.forEach(button => {
                    button.btn.disabled = true;
                });
            }
        } 
        else {
            alert(user.LOSE_MESSAGE);
            this.buttons.forEach(button => {
                button.btn.textContent = button.order;
                button.btn.disabled = true;
            });
        }
    }
}

//function to generate random hex color
//Used ChatGPT to help with this function
function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateButtons(){
    if (window.currentShuffler) {
        window.currentShuffler.stop();
    }

    // Clear existing buttons
    arrayButtons.forEach(button => button.btn.remove());
    arrayButtons = [];

    // Get number of buttons from input
    const buttonCount = document.getElementById("buttons").value;

    // Create new buttons
    for (let i = 0; i < buttonCount; i++) {
        arrayButtons.push(new Button(
            getRandomColor(),
            i + 1
        ));
    }

    //Start the game and enable shuffling
    const game = new Game(arrayButtons);
    window.currentShuffler = new Shuffler(arrayButtons);
    window.currentShuffler.start(game);
}

document.addEventListener("DOMContentLoaded", () => {
    //Set button text from user class
    const submitButton = document.getElementById("go-btn");
    submitButton.textContent = user.GO_MESSAGE;

    //Set label text from user class
    const label = document.getElementById("go-btn-label");
    label.textContent = user.BUTTON_CREATION_MESSAGE;
});

document.getElementById("button-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission
    generateButtons();
});