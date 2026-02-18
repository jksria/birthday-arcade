/* NAVIGATION */

let currentGame = "";
let currentScore = 0;

function submitScore(game, score) {
  currentGame = game;
  currentScore = score;
  document.getElementById("nameModal").style.display = "flex";
}

function saveScore() {
  let name = document.getElementById("playerName").value;
  if (!name) return;

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({
    name: name,
    game: currentGame,
    score: currentScore
  });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  document.getElementById("nameModal").style.display = "none";
  document.getElementById("playerName").value = "";
  showLeaderboard();
}

function showLeaderboard() {
  startGame("leaderboard");
  let list = document.getElementById("leaderboardList");
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  list.innerHTML = leaderboard.map(entry =>
    `<div>${entry.name} - ${entry.game} - ${entry.score}</div>`
  ).join("");
}


function startGame(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'snow') initSnow();
  if (id === 'quiz') loadQuiz();
  if (id === "cake") resetCakeGame();

}



function goHome() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
}

/* SNOW CATCH GAME */

let snowCanvas = document.getElementById("snowCanvas");
let ctx = snowCanvas.getContext("2d");
let snowflakes = [];
let snowScore = 0;
let snowRunning = false;

function initSnow() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight * 0.6;
  snowflakes = [];
  snowScore = 0;
  snowRunning = true;
  document.getElementById("snowScore").innerText = "Score: 0";
  animateSnow();
}

function animateSnow() {
  if (!snowRunning) return;

  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  if (Math.random() < 0.05) {
    snowflakes.push({
      x: Math.random() * snowCanvas.width,
      y: 0,
      size: 50
    });
  }

  snowflakes.forEach((flake, index) => {
    flake.y += 3;
    ctx.font = "20px Arial";
    ctx.fillText("❄️", flake.x, flake.y);

    if (flake.y > snowCanvas.height) {
      snowflakes.splice(index, 1);
    }
  });

  requestAnimationFrame(animateSnow);
}



snowCanvas.addEventListener("click", function(e) {
  let rect = snowCanvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  snowflakes.forEach((flake, index) => {
    if (Math.abs(x - flake.x) < 20 && Math.abs(y - flake.y) < 20) {
      snowflakes.splice(index, 1);
      snowScore++;
      document.getElementById("snowScore").innerText = "Score: " + snowScore;
    }
  });
});

/* CAKE SMASH */

let cakeWrapper = document.getElementById("cakeWrapper");
let cake = document.getElementById("cake");
let cakeScore = 0;
let cakeGameActive = true;

function resetCakeGame() {
  cakeScore = 0;
  cakeGameActive = true;
  document.getElementById("cakeScore").innerText = "Smashes: 0";
}

cake.addEventListener("click", function(e) {
  e.stopPropagation();
  if (!cakeGameActive) return;
  smashCake();
});


function smashCake() {
  cakeScore++;
  document.getElementById("cakeScore").innerText =
    "Smashes: " + cakeScore;

  cake.style.transform = "scale(1.15)";
  setTimeout(() => {
    cake.style.transform = "scale(1)";
  }, 80);

  if (cakeScore % 10 === 0) {
    cake.innerText = "🎉";
    setTimeout(() => {
      cake.innerText = "🎂";
    }, 300);
  }
}


function endCakeGame() {
  if (!cakeGameActive) return;

  cakeGameActive = false;

  submitScore("Cake Smash", cakeScore);
}


/* MILA QUIZ GAME */

let questions = [
  {
    question: "What was Mila's birth weight?",
    options: ["6 lbs 4 oz", "7 lbs 2 oz", "8 lbs 1 oz"],
    answer: 1
  },
  {
    question: "What time was she born?",
    options: ["2:15 AM", "8:42 AM", "11:03 PM"],
    answer: 0
  }
];

function loadQuiz() {
  let container = document.getElementById("quizContainer");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    let div = document.createElement("div");
    div.innerHTML = `<p>${q.question}</p>`;
    q.options.forEach((opt, i) => {
      let btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (i === q.answer) {
          btn.style.background = "lightgreen";
        } else {
          btn.style.background = "salmon";
        }
      };
      div.appendChild(btn);
    });
    container.appendChild(div);
  });
}


function checkOrientation() {
  const warning = document.getElementById("rotateWarning");
  if (window.innerHeight > window.innerWidth) {
    warning.style.display = "flex";
  } else {
    warning.style.display = "none";
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);
