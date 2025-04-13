let scores = [0, 0];
let currentTurn = 0;
let turnTotal = 0;
let gameActive = true;

let history = JSON.parse(localStorage.getItem("gameHistory")) || [];
let roundCount = history.length;

const rollBtn = document.querySelector(".roll");
const holdBtn = document.querySelector(".hold");
const resetBtn = document.querySelector(".reset");
const dice = document.querySelector(".dice");
const playerOneDisplay = document.querySelector(".player-one h2");
const playerTwoDisplay = document.querySelector(".player-two h2");
const playerOneContainer = document.querySelector(".player-one");
const playerTwoContainer = document.querySelector(".player-two");

function rollDice() {
  if (!gameActive) return;

  dice.style.animation = "rotate 0.8s infinite linear";

  setTimeout(() => {
    dice.style.animation = "";
    const roll = Math.floor(Math.random() * 6) + 1;
    showDiceFace(roll);

    if (roll === 1) {
      turnTotal = 0;
      clearTurnDetails();
      switchPlayer();
    } else {
      turnTotal += roll;
      appendRollToUI(roll);
    }

    updateUI();
  }, 1500);
}

function holdTurn() {
  if (!gameActive) return;

  scores[currentTurn] += turnTotal;
  turnTotal = 0;

  // Save history
  roundCount++;
  const roundData = {
    round: roundCount,
    player1: scores[0],
    player2: scores[1]
  };
  history.push(roundData);
  localStorage.setItem("gameHistory", JSON.stringify(history));
  addRowToTable(roundData);

  if (scores[currentTurn] >= 30) {
    alert(`Player ${currentTurn + 1} wins!`);
    gameActive = false;
    return;
  }

  clearTurnDetails();
  switchPlayer();
  updateUI();
}

function resetGame() {
  scores = [0, 0];
  currentTurn = 0;
  turnTotal = 0;
  gameActive = true;
  clearTurnDetails();
  updateUI();
  showDiceFace(1);

  // Clear history
  history = [];
  roundCount = 0;
  localStorage.removeItem("gameHistory");
  document.getElementById("history-body").innerHTML = "";
}

function switchPlayer() {
  currentTurn = currentTurn === 0 ? 1 : 0;
}

function updateUI() {
  playerOneDisplay.textContent = `Player 1 Score: ${scores[0]}${currentTurn === 0 ? " 👈" : ""}`;
  playerTwoDisplay.textContent = `Player 2 Score: ${scores[1]}${currentTurn === 1 ? " 👈" : ""}`;
}

function showDiceFace(roll) {
  const angles = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateY(180deg)",
    3: "rotateY(-90deg)",
    4: "rotateY(90deg)",
    5: "rotateX(-90deg)",
    6: "rotateX(90deg)"
  };
  dice.style.transform = angles[roll];
}

function appendRollToUI(roll) {
  const p = document.createElement("p");
  p.textContent = `Rolled: ${roll}`;
  if (currentTurn === 0) {
    playerOneContainer.appendChild(p);
  } else {
    playerTwoContainer.appendChild(p);
  }
}

function clearTurnDetails() {
  const paragraphs = document.querySelectorAll(".player-one p, .player-two p");
  paragraphs.forEach(p => p.remove());
}

function addRowToTable(data) {
  const tbody = document.getElementById("history-body");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.round}</td>
    <td>${data.player1}</td>
    <td>${data.player2}</td>
  `;
  tbody.appendChild(row);
}

function loadHistory() {
  history.forEach(round => {
    addRowToTable(round);
  });
}

rollBtn.addEventListener("click", rollDice);
holdBtn.addEventListener("click", holdTurn);
resetBtn.addEventListener("click", resetGame);

document.addEventListener("DOMContentLoaded", function () {
  resetGame();
  loadHistory();
});
