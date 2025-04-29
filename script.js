// === Tic Tac Toe Game Logic with Sounds and Mode ===

let currentPlayer = 'X'; let board = ['', '', '', '', '', '', '', '', '']; let isGameActive = false; let gameMode = ''; let scores = { X: 0, O: 0 }; let winCount = { X: 0, O: 0 };

const winSound = new Audio('/sounds/success-fanfare-trumpets-6185.mp3'); const drawSound = new Audio('/sounds/match-cave-164967.mp3'); const clickSound = new Audio('/sounds/button-clickk(chosic.com).mp3');

const cells = document.querySelectorAll('.cell'); const gameStatus = document.querySelector('.game-status'); const gameBoard = document.querySelector('.game-board'); const startButton = document.getElementById('start-button'); const deviceButtons = document.getElementById('device-select'); const modeButtons = document.getElementById('mode-select'); const scoreBoard = document.querySelector('.score-board'); const restartButton = document.getElementById('restart');

startButton.addEventListener('click', () => { clickSound.play(); startButton.style.display = 'none'; deviceButtons.style.display = 'flex'; });

document.getElementById('mobile').addEventListener('click', () => { clickSound.play(); document.body.classList.add('mobile'); deviceButtons.style.display = 'none'; modeButtons.style.display = 'flex'; });

document.getElementById('desktop').addEventListener('click', () => { clickSound.play(); document.body.classList.remove('mobile'); deviceButtons.style.display = 'none'; modeButtons.style.display = 'flex'; });

document.getElementById('two-player').addEventListener('click', () => { clickSound.play(); gameMode = '2player'; modeButtons.style.display = 'none'; gameBoard.style.display = 'grid'; scoreBoard.style.display = 'flex'; isGameActive = true; });

document.getElementById('computer').addEventListener('click', () => { clickSound.play(); gameMode = 'computer'; modeButtons.style.display = 'none'; gameBoard.style.display = 'grid'; scoreBoard.style.display = 'flex'; isGameActive = true; });

cells.forEach((cell, index) => { cell.addEventListener('click', () => handleCellClick(index)); });

function handleCellClick(index) { if (!isGameActive || board[index] !== '') return; if (gameMode === 'computer' && currentPlayer === 'O') return;

clickSound.play(); board[index] = currentPlayer; cells[index].textContent = currentPlayer;

if (checkWinner()) { winSound.play(); scores[currentPlayer]++; updateScore(); gameStatus.textContent = ${currentPlayer} wins!; isGameActive = false; winCount[currentPlayer]++; if (winCount[currentPlayer] === 3) { setTimeout(() => showWinner(currentPlayer), 1000); } else { setTimeout(resetBoard, 1500); } return; }

if (!board.includes('')) { drawSound.play(); gameStatus.textContent = 'Draw!'; setTimeout(resetBoard, 1500); return; }

currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; if (gameMode === 'computer' && currentPlayer === 'O') { setTimeout(computerMove, 800); } }

function computerMove() { const emptyIndexes = board.map((val, i) => val === '' ? i : null).filter(i => i !== null); const move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]; handleCellClick(move); }

function checkWinner() { const winCombos = [ [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6] ]; return winCombos.some(combo => { const [a,b,c] = combo; return board[a] && board[a] === board[b] && board[b] === board[c]; }); }

function resetBoard() { board = ['', '', '', '', '', '', '', '', '']; cells.forEach(cell => cell.textContent = ''); currentPlayer = 'X'; gameStatus.textContent = Turn: ${currentPlayer}; isGameActive = true; }

function updateScore() { document.getElementById('scoreX').textContent = scores['X']; document.getElementById('scoreO').textContent = scores['O']; }

function showWinner(player) { document.body.innerHTML = <h1>${player} is the Winner! 🏆</h1> <canvas id="confetti"></canvas> <button onclick="location.reload()">Restart Game</button>; // Confetti code can be inserted here (JS library or custom) }

restartButton.addEventListener('click', () => { clickSound.play(); board = ['', '', '', '', '', '', '', '', '']; scores = { X: 0, O: 0 }; winCount = { X: 0, O: 0 }; updateScore(); resetBoard(); gameStatus.textContent = 'Game Restarted'; });

