const boardSize = 20;
let direction = "right";
let gameState = "STOP";
let snake = [
  {
    x: 12,
    y: 12,
  },
];
let interval;
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let foodLocation = {
  x: 1,
  y: 1,
};

const rainbowColors = [
  '#ec2127', // red
  '#ff6b35', // orange
  '#f7931e', // yellow-orange
  '#fdc82f', // yellow
  '#8cc63f', // green
  '#00aeef', // blue
  '#92278f'  // purple
];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function renderFood() {
  foodLocation = {
    x: getRandomArbitrary(1, 25),
    y: getRandomArbitrary(1, 25),
  };
  document.getElementById("food")?.remove();
  let food = document.createElement("div");
  food.setAttribute("id", "food");
  food.style.gridRow = foodLocation.x;
  food.style.gridColumn = foodLocation.y;
  document.getElementById("board").appendChild(food);
}

function renderSnake() {
  document.querySelectorAll(".snake").forEach((elem) => elem.remove());
  snake.forEach((piece, id) => {
    let snakePiece = document.createElement("div");
    snakePiece.setAttribute("class", "snake");
    snakePiece.style.gridRow = piece.x;
    snakePiece.style.gridColumn = piece.y;
    // Rainbow effect based on position in snake
    const colorIndex = id % rainbowColors.length;
    snakePiece.style.backgroundColor = rainbowColors[colorIndex];
    snakePiece.style.boxShadow = `0 0 ${id === 0 ? '10' : '5'}px ${rainbowColors[colorIndex]}`;
    document.getElementById("board").appendChild(snakePiece);
  });
}

function moveSnake() {
  let head = { ...snake[0] };
  switch (direction) {
    case "right":
      if (head.y === 25) {
        head.y = 1;
      } else {
        head.y++;
      }
      break;
    case "up":
      if (head.x === 1) {
        head.x = 25;
      } else {
        head.x--;
      }
      break;
    case "down":
      if (head.x === 25) {
        head.x = 1;
      } else {
        head.x++;
      }
      break;
    case "left":
      if (head.y === 1) {
        head.y = 25;
      } else {
        head.y--;
      }
      break;
  }
  snake.unshift(head);
}

function handleKeyDown(e) {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      if (direction === "down") return;
      direction = "up";
      break;
    case "s":
    case "ArrowDown":
      if (direction === "up") return;
      direction = "down";
      break;
    case "a":
    case "ArrowLeft":
      if (direction === "right") return;
      direction = "left";
      break;
    case "d":
    case "ArrowRight":
      if (direction === "left") return;
      direction = "right";
      break;
    case " ":
      if (gameState === "PLAYING") {
        pauseGame();
      } else {
        startGame();
      }
      break;
  }
}

function checkFood() {
  let head = { ...snake[0] };
  if (head.x === foodLocation.x && head.y === foodLocation.y) {
    renderFood();
    score++;
  } else {
    snake.pop();
  }
}

function checkCollision() {
  let head = { ...snake[0] };
  snake.forEach((piece, i) => {
    if (i === 0) return;
    if (piece.x === head.x && piece.y === head.y) {
      clearInterval(interval);
      gameState = "GAMEOVER";
      // Update high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
      }
    }
  });
}

function main() {
  renderFood();
  renderSnake();
  document.addEventListener("keydown", handleKeyDown);
}

function pauseGame() {
  clearInterval(interval);
  gameState = "PAUSE";
}

function renderScore() {
  const scoreElement = document.getElementById("score");
  if (gameState === "GAMEOVER") {
    scoreElement.innerHTML = `GAME OVER !!! SCORE: ${score} | HIGH SCORE: ${highScore}`;
    scoreElement.classList.add("gameover");
  } else {
    scoreElement.innerHTML = `SCORE: ${score} | HIGH SCORE: ${highScore}`;
    scoreElement.classList.remove("gameover");
  }
}

function startGame() {
  if (gameState === "GAMEOVER") {
    score = 0;
    snake = [
      {
        x: 12,
        y: 12,
      },
    ];
  }
  gameState = "PLAYING";
  interval = setInterval(() => {
    moveSnake();
    checkCollision();
    checkFood();
    if (gameState != "GAMEOVER") {
      renderSnake();
    }
    renderScore();
  }, 100);
}

main();
