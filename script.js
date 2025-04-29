const startBtn = document.getElementById('start-button');
const deviceSelect = document.getElementById('device-select');
const modeSelect = document.getElementById('mode-select');
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cell');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const bgMusic = document.getElementById('bgMusic');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let score = { X: 0, O: 0 };
let mode = '2p';

startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  deviceSelect.classList.remove('hidden');
});

deviceSelect.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    deviceSelect.classList.add('hidden');
    modeSelect.classList.remove('hidden');
  }
});

modeSelect.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    mode = e.target.dataset.mode;
    modeSelect.classList.add('hidden');
    gameContainer.classList.remove('hidden');
  }
});

cells.forEach(cell => {
  cell.addEventListener('click', () => handleMove(cell));
});

resetBtn.addEventListener('click', () => {
  score = { X: 0, O: 0 };
  scoreX.textContent = '0';
  scoreO.textContent = '0';
  resetGame();
});

function handleMove(cell) {
  const index = cell.getAttribute('data-cell-index');

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  clickSound.play();

  if (checkWinner()) {
    winSound.play();
    score[currentPlayer]++;
    updateScores();
    showStatus(`${currentPlayer} wins!`);
    if (score[currentPlayer] >= 3) {
      showStatus(`${currentPlayer} is the WINNER 🏆`);
      launchConfetti();
    } else {
      setTimeout(resetGame, 1500);
    }
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    showStatus('Draw!');
    setTimeout(resetGame, 1500);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  showStatus(`Player ${currentPlayer}'s turn`);
}

function updateScores() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
}

function showStatus(message) {
  statusText.textContent = message;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(cell => (cell.textContent = ''));
  showStatus(`Player ${currentPlayer}'s turn`);
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

// Simple Confetti
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 10 + 2,
    speed: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -10;
    });
    requestAnimationFrame(draw);
  }

  draw();
  setTimeout(() => (ctx.clearRect(0, 0, canvas.width, canvas.height)), 3000);
                    }
