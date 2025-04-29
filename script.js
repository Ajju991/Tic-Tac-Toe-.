const startBtn = document.getElementById("start-btn");
const deviceContainer = document.getElementById("device-selection");
const modeContainer = document.getElementById("mode-selection");
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const scoreDisplay = document.getElementById("score");
const confettiCanvas = document.getElementById("confetti");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let gameMode = "";
let scores = { X: 0, O: 0 };
let winnerDeclared = false;

// Load sound effects
const clickSound = new Audio("button-305770.mp3");
const winSound = new Audio("success-fanfare-trumpets-6185.mp3");
const gameStartSound = new Audio("match-cave-164967.mp3");

// Confetti setup using JSConfetti (optional library)
// Load JSConfetti if not using canvas
let jsConfetti = null;
if (confettiCanvas) {
  jsConfetti = new JSConfetti({ canvas: confettiCanvas });
}

startBtn.addEventListener("click", () => {
  clickSound.play();
  startBtn.style.display = "none";
  deviceContainer.style.display = "flex";
});

document.querySelectorAll(".device-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    clickSound.play();
    deviceContainer.style.display = "none";
    modeContainer.style.display = "flex";
    document.body.classList.add(btn.dataset.device);
  });
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    clickSound.play();
    modeContainer.style.display = "none";
    gameMode = btn.dataset.mode;
    initGame();
  });
});

function initGame() {
  board.style.display = "grid";
  statusText.style.display = "block";
  restartBtn.style.display = "inline-block";
  scoreDisplay.style.display = "block";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  winnerDeclared = false;
  updateStatus();
  clearBoard();
  updateScore();
  gameStartSound.play();
}

function updateStatus() {
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function clearBoard() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
  });
}

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.dataset.cellIndex);
  if (!gameActive || gameBoard[index]) return;

  gameBoard[index] = currentPlayer;
  cell.textContent = currentPlayer;
  clickSound.play();

  if (checkWin()) {
    gameActive = false;
    scores[currentPlayer]++;
    updateScore();
    statusText.textContent = `Player ${currentPlayer} wins!`;
    winSound.play();

    if (jsConfetti) jsConfetti.addConfetti();

    if (scores[currentPlayer] === 3) {
      setTimeout(() => {
        alert(`Winner 🏆: Player ${currentPlayer}`);
        scores = { X: 0, O: 0 };
        updateScore();
      }, 1000);
    } else {
      setTimeout(initGame, 2000);
    }

    return;
  }

  if (!gameBoard.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    setTimeout(initGame, 2000);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function checkWin() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function updateScore() {
  scoreDisplay.textContent = `Score - X: ${scores.X} | O: ${scores.O}`;
}

restartBtn.addEventListener("click", () => {
  clickSound.play();
  scores = { X: 0, O: 0 };
  initGame();
});

// Add listeners to each cell
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});
