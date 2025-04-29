const startScreen = document.getElementById("start-screen");
const deviceSelect = document.getElementById("device-select");
const modeSelect = document.getElementById("mode-select");
const gameContainer = document.getElementById("game-container");
const board = document.getElementById("board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-button");
const playerXScoreSpan = document.getElementById("playerX-score");
const playerOScoreSpan = document.getElementById("playerO-score");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0 };
let winnerDeclared = false;
let gameMode = "";
let wins = { X: 0, O: 0 };
let gameCount = 0;

// Load sounds
const clickSound = new Audio("button-clickk(chosic.com).mp3");
const winSound = new Audio("success-fanfare-trumpets-6185.mp3");
const drawSound = new Audio("match-cave-164967.mp3");

document.getElementById("start-button").addEventListener("click", () => {
  clickSound.play();
  startScreen.classList.add("hidden");
  deviceSelect.classList.remove("hidden");
});

window.selectDevice = (device) => {
  clickSound.play();
  deviceSelect.classList.add("hidden");
  modeSelect.classList.remove("hidden");
};

window.selectMode = (mode) => {
  clickSound.play();
  modeSelect.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameMode = mode;
  startGame();
};

function startGame() {
  board.innerHTML = "";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  winnerDeclared = false;
  status.textContent = `Player ${currentPlayer}'s turn`;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const idx = e.target.dataset.index;
  if (gameBoard[idx] !== "" || winnerDeclared) return;
  if (gameMode === "computer" && currentPlayer === "O") return;

  clickSound.play();
  gameBoard[idx] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    winSound.play();
    scores[currentPlayer]++;
    updateScore();
    status.textContent = `Player ${currentPlayer} wins!`;
    winnerDeclared = true;
    gameCount++;
    if (scores[currentPlayer] >= 3) {
      showConfetti();
      alert(`Winner 🏆: Player ${currentPlayer}`);
      scores = { X: 0, O: 0 };
    }
    setTimeout(startGame, 1500);
  } else if (!gameBoard.includes("")) {
    drawSound.play();
    status.textContent = "Draw!";
    setTimeout(startGame, 1500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
    if (gameMode === "computer" && currentPlayer === "O") {
      setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  let empty = gameBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  let random = empty[Math.floor(Math.random() * empty.length)];
  const cell = document.querySelector(`.cell[data-index='${random}']`);
  if (cell) cell.click();
}

function updateScore() {
  playerXScoreSpan.textContent = `Player X: ${scores.X}`;
  playerOScoreSpan.textContent = `Player O: ${scores.O}`;
}

restartBtn.addEventListener("click", () => {
  clickSound.play();
  scores = { X: 0, O: 0 };
  updateScore();
  startGame();
});

// Confetti setup
function showConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
  }, 250);
  }
