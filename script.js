// Sound files
const clickSound = new Audio('button-305770.mp3');
const matchStartSound = new Audio('match-cave-164967.mp3');
const winSound = new Audio('success-fanfare-trumpets-6185.mp3');

// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let playerScores = { X: 0, O: 0 };
const maxWins = 3;

// DOM elements
const startScreen = document.getElementById('start-screen');
const deviceScreen = document.getElementById('device-screen');
const modeScreen = document.getElementById('mode-screen');
const gameContainer = document.getElementById('game-container');
const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');
const resetButton = document.getElementById('reset-button');
const finalWinner = document.getElementById('final-winner');

document.getElementById('start-button').addEventListener('click', () => {
    clickSound.play();
    startScreen.style.display = 'none';
    deviceScreen.style.display = 'flex';
});

document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        clickSound.play();
        deviceScreen.style.display = 'none';
        modeScreen.style.display = 'flex';
    });
});

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        clickSound.play();
        modeScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        gameActive = true;
        updateStatus();
        matchStartSound.play();
    });
});

board.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-cell-index');
    if (!gameActive || !index || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    clickSound.play();

    if (checkWinner()) {
        winSound.play();
        playerScores[currentPlayer]++;
        updateStatus(`${currentPlayer} wins!`);
        showTemporaryWin(currentPlayer);

        if (playerScores[currentPlayer] >= maxWins) {
            showFinalWinner(currentPlayer);
            gameActive = false;
        } else {
            setTimeout(resetBoard, 1500);
        }

        return;
    }

    if (!gameBoard.includes('')) {
        updateStatus(`It's a draw!`);
        setTimeout(resetBoard, 1500);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
});

resetButton.addEventListener('click', () => {
    clickSound.play();
    playerScores = { X: 0, O: 0 };
    finalWinner.textContent = '';
    gameActive = true;
    currentPlayer = 'X';
    resetBoard();
});

function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => (cell.textContent = ''));
    currentPlayer = 'X';
    gameActive = true;
    updateStatus();
}

function checkWinner() {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    return winCombos.some(combo => {
        const [a, b, c] = combo;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function updateStatus(message = '') {
    if (message) {
        statusDisplay.textContent = message;
    } else {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function showTemporaryWin(winner) {
    statusDisplay.textContent = `Player ${winner} wins! Score: ${playerScores[winner]}`;
}

function showFinalWinner(winner) {
    finalWinner.textContent = `🏆 Player ${winner} is the Champion! 🏆`;
    launchConfetti();
}

function launchConfetti() {
    // You can use confetti.js or another animation library for effects
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    confettiScript.onload = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    };
    document.body.appendChild(confettiScript);
                }
