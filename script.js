// Sound effects
const startSound = new Audio('button-305770.mp3');
const moveSound = new Audio('match-cave-164967.mp3');
const winSound = new Audio('success-fanfare-trumpets-6185.mp3');

// DOM elements
const startScreen = document.getElementById('start-screen');
const deviceScreen = document.getElementById('device-screen');
const modeScreen = document.getElementById('mode-screen');
const gameScreen = document.getElementById('game-screen');
const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-button');
const title = document.getElementById('title');
const confetti = document.getElementById('confetti-canvas');

// State
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let mode = '';
let scoreX = 0;
let scoreO = 0;

// Start game
document.getElementById('start-button').addEventListener('click', () => {
    startSound.play();
    startScreen.style.display = 'none';
    deviceScreen.style.display = 'flex';
});

// Device selection
document.getElementById('mobile-btn').addEventListener('click', () => {
    document.body.className = 'mobile';
    deviceScreen.style.display = 'none';
    modeScreen.style.display = 'flex';
});

document.getElementById('desktop-btn').addEventListener('click', () => {
    document.body.className = 'desktop';
    deviceScreen.style.display = 'none';
    modeScreen.style.display = 'flex';
});

// Mode selection
document.getElementById('two-player-btn').addEventListener('click', () => {
    mode = '2player';
    modeScreen.style.display = 'none';
    startGame();
});

document.getElementById('computer-btn').addEventListener('click', () => {
    mode = 'computer';
    modeScreen.style.display = 'none';
    startGame();
});

function startGame() {
    gameScreen.style.display = 'flex';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    updateScores();
}

// Click on cell
cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-cell-index');
        if (gameBoard[index] !== '' || !gameActive) return;

        moveSound.play();
        gameBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWinner()) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            winSound.play();
            triggerConfetti();
            updateScore(currentPlayer);
            setTimeout(resetBoard, 2000);
            return;
        }

        if (!gameBoard.includes('')) {
            statusDisplay.textContent = 'Draw!';
            setTimeout(resetBoard, 1500);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

        if (mode === 'computer' && currentPlayer === 'O') {
            setTimeout(() => {
                computerMove();
            }, 500);
        }
    });
});

// Computer Move
function computerMove() {
    const emptyIndices = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    if (randIndex !== undefined) {
        gameBoard[randIndex] = 'O';
        cells[randIndex].textContent = 'O';
        moveSound.play();
        if (checkWinner()) {
            statusDisplay.textContent = `Computer wins!`;
            gameActive = false;
            winSound.play();
            triggerConfetti();
            updateScore('O');
            setTimeout(resetBoard, 2000);
            return;
        }

        if (!gameBoard.includes('')) {
            statusDisplay.textContent = 'Draw!';
            setTimeout(resetBoard, 1500);
            return;
        }

        currentPlayer = 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Check winner
function checkWinner() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return winPatterns.some(([a, b, c]) => 
        gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]
    );
}

// Reset Board
function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Update scores
function updateScore(winner) {
    if (winner === 'X') scoreX++;
    else scoreO++;
    updateScores();

    if (scoreX === 3 || scoreO === 3) {
        statusDisplay.textContent = `Winner 🏆: ${winner === 'X' ? 'Player X' : mode === '2player' ? 'Player O' : 'Computer'}`;
        gameActive = false;
        setTimeout(resetGame, 4000);
    }
}

function updateScores() {
    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
}

// Reset game fully
restartBtn.addEventListener('click', resetGame);

function resetGame() {
    scoreX = 0;
    scoreO = 0;
    updateScores();
    resetBoard();
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Confetti effect
function triggerConfetti() {
    if (window.confetti) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
              }e
