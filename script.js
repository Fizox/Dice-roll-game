let scores = [0, 0];
let currentTurn = 0;
let turnTotal = 0;
let gameActive = true;

let roundScores = [null, null];
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

  // تعطيل الأزرار مؤقتًا
  rollBtn.disabled = true;
  holdBtn.disabled = true;

  dice.style.animation = "rotate 0.8s infinite linear";

  setTimeout(() => {
    dice.style.animation = "";
    const roll = Math.floor(Math.random() * 6) + 1;
    showDiceFace(roll);
    appendRollToUI(roll);

    if (roll === 1) {
      turnTotal = 0;
      roundScores[currentTurn] = scores[currentTurn]; // ما يغير قيمته للـ 0
      clearTurnDetails();

      if (roundScores[0] !== null && roundScores[1] !== null) {
        roundCount++;
        const roundData = {
          round: roundCount,
          player1: roundScores[0],
          player2: roundScores[1],
          end: null
        };
        history.push(roundData);
        localStorage.setItem("gameHistory", JSON.stringify(history));
        addRowToTable(roundData);
        roundScores = [null, null];
      }

      switchPlayer();
      updateUI();

      // تفعيل الأزرار من جديد
      rollBtn.disabled = false;
      holdBtn.disabled = false;
      return;
    }

    turnTotal += roll;
    updateUI();

    // تفعيل الأزرار بعد انتهاء الحركة
    rollBtn.disabled = false;
    holdBtn.disabled = false;
  }, 1500);
}


function holdTurn() {
  if (!gameActive) return;

  scores[currentTurn] += turnTotal;
  roundScores[currentTurn] = scores[currentTurn];
  turnTotal = 0;

  let winner = null;
  if (scores[currentTurn] >= 30) {
    winner = `Player ${currentTurn + 1} win`;

    // تسجيل الفوز في الجدول
    roundScores[currentTurn] = scores[currentTurn];
    roundScores[currentTurn === 0 ? 1 : 0] = scores[currentTurn === 0 ? 1 : 0];

    roundCount++;
    const roundData = {
      round: roundCount,
      player1: roundScores[0],
      player2: roundScores[1],
      end: winner
    };
    history.push(roundData);
    localStorage.setItem("gameHistory", JSON.stringify(history));
    addRowToTable(roundData);

    alert(winner); // Show alert on win
    scores = [0, 0]; // Reset scores
    roundScores = [null, null]; // Reset round scores
    gameActive = false;  // Stop the game
    clearTurnDetails(); // Clear all rolls after win
    updateUI();
    
    // إعادة تعيين اللعبة مباشرة بعد الفوز
    setTimeout(() => {
      gameActive = true;  // إعادة تفعيل اللعبة
      updateUI();  // تحديث واجهة المستخدم
      showDiceFace(1);  // إعادة عرض الوجه الأول للنرد
    }, 1000); // التأخير لمدة ثانية لإظهار النتيجة قبل البدء من جديد
    
    return;
  }

  if (roundScores[0] !== null && roundScores[1] !== null) {
    roundCount++;
    const roundData = {
      round: roundCount,
      player1: roundScores[0] !== null ? roundScores[0] : 0,
      player2: roundScores[1] !== null ? roundScores[1] : 0,
      end: null
    };
    history.push(roundData);
    localStorage.setItem("gameHistory", JSON.stringify(history));
    addRowToTable(roundData);
    roundScores = [null, null];
  }

  clearTurnDetails();
  switchPlayer();
  updateUI();
}

function resetGame() {
  // أول إشي سجّل النقاط الحالية
  roundCount++;
  const roundData = {
    round: roundCount,
    player1: scores[0],
    player2: scores[1],
    end: "Reseted"
  };
  history.push(roundData);
  localStorage.setItem("gameHistory", JSON.stringify(history));
  addRowToTable(roundData);

  // بعدين صفّر القيم
  scores = [0, 0];
  currentTurn = 0;
  turnTotal = 0;
  gameActive = true;
  roundScores = [null, null];
  clearTurnDetails();
  updateUI();
  showDiceFace(1);
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
    <td>${data.end ? data.end : ""}</td>
  `;
  tbody.appendChild(row);
}

function loadHistory() {
  const tbody = document.getElementById("history-body");
  if (!tbody) return;

  if (history && history.length > 0) {
    for (let i = 0; i < history.length; i++) {
      addRowToTable(history[i]);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadHistory();
  updateUI();
  showDiceFace(1);
});

rollBtn.addEventListener("click", rollDice);
holdBtn.addEventListener("click", holdTurn);
resetBtn.addEventListener("click", resetGame);
