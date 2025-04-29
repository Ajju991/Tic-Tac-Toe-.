const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const deviceScreen = document.getElementById('device-screen');
const mobileBtn = document.getElementById('mobile-btn');
const desktopBtn = document.getElementById('desktop-btn');
const modeScreen = document.getElementById('mode-screen');
const twoPlayerBtn = document.getElementById('two-player-btn');
const computerBtn = document.getElementById('computer-btn');
const gameContainer = document.getElementById('game-container');
const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-button');
const playerXScoreSpan = document.getElementById('playerX-score');
const playerOScoreSpan = document.getElementById('playerO-score');
const winnerScreen = document.getElementById('winner-screen');
const winnerName = document.getElementById('winner-name');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isVsComputer = false;
let scores = { X: 0, O: 0 };

const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');
const moveSound = document.getElementById('move-sound');
const confettiCanvas = document.getElementById('confetti');

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    deviceScreen.style.display = 'block';
});

mobileBtn.addEventListener('click', () => {
    document.body.classList.add('mobile');
    deviceScreen.style.display = 'none';
    modeScreen.style.display = 'block';
});

desktopBtn.addEventListener('click', () => {
    document.body.classList.add('desktop');
    deviceScreen.style.display = 'none';
    modeScreen.style.display = 'block';
});

twoPlayerBtn.addEventListener('click', () => {
    isVsComputer = false;
    startGame();
});

computerBtn.addEventListener('click', () => {
    isVsComputer = true;
    startGame();
});

function startGame() {
    modeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    updateStatus();
    addEventListeners();
}

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-cell-index'));
    if (gameBoard[index] || !gameActive) return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    moveSound.play();

    if (checkWinner()) {
        gameActive = false;
        scores[currentPlayer]++;
        updateScore();
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        winSound.play();
        setTimeout(() => {
            if (scores[currentPlayer] === 3) {
                showWinner(currentPlayer);
            } else {
                resetBoard();
            }
        }, 1500);
        return;
    }

    if (!gameBoard.includes('')) {
        statusDisplay.textContent = 'It\'s a draw!';
        drawSound.play();
        gameActive = false;
        setTimeout(resetBoard, 1500);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (isVsComputer && currentPlayer === 'O') {
        setTimeout(computerMove, 700);
    }
}

function computerMove() {
    let emptyCells = gameBoard.map((val, i) => val === '' ? i : null).filter(i => i !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.querySelector(`.cell[data-cell-index="${randomIndex}"]`);
    handleCellClick({ target: cell });
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function updateStatus() {
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function updateScore() {
    playerXScoreSpan.textContent = scores['X'];
    playerOScoreSpan.textContent = scores['O'];
}

function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    updateStatus();
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
}

function resetGame() {
    scores = { X: 0, O: 0 };
    updateScore();
    winnerScreen.style.display = 'none';
    confettiCanvas.style.display = 'none';
    resetBoard();
}

function showWinner(player) {
    winnerName.textContent = `Player ${player} is the WINNER!`;
    winnerScreen.style.display = 'block';
    confettiCanvas.style.display = 'block';
    startConfetti();
}

function addEventListeners() {
    document.querySelectorAll('.cell').forEach(cell =>
        cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
}

// -------- Confetti -------- //
function startConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0
    }));

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.beginPath();
            ctx.fillStyle = c.color;
            ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tiltAngle, 0, Math.PI * 2);
            ctx.fill();
        });
        updateConfetti();
    }

    function updateConfetti() {
        confetti.forEach(c => {
            c.y += Math.cos(c.d) + 1 + c.r / 2;
            c.x += Math.sin(c.d);
            c.tiltAngle += 0.1;
            if (c.y > canvas.height) {
                c.y = -20;
                c.x = Math.random() * canvas.width;
            }
        });
    }

    let interval = setInterval(drawConfetti, 20);
    setTimeout(() => {
        clearInterval(interval);
        canvas.style.display = 'none';
    }, 5000);
    }
