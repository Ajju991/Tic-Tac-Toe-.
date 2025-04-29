const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const clickSound = document.getElementById('clickSound');

const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = { X: 0, O: 0 };

function handleCellClick(event) {
  const clickedCell = event.target;
  const index = parseInt(clickedCell.getAttribute('data-cell-index'));

  if (gameBoard[index] !== '' || !gameActive) return;

  clickSound.currentTime = 0;
  clickSound.play();

  gameBoard[index] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  if (checkWinner()) {
    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScores();
    gameActive = false;
    return;
  }

  if (!gameBoard.includes('')) {
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c];
  });
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `Player X's turn`;

  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
  });

  scores = { X: 0, O: 0 };
  updateScores();
}

board.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);
