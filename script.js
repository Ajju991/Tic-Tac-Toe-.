const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const modeButtons = document.querySelectorAll('.mode-button');

let gameMode = '2p'; // Default

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        gameMode = button.getAttribute('data-mode');
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
    });
});
