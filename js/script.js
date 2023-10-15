const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const size = 30;
const audio = new Audio('../assets/assets.mp3')
let direction, loopId;

const score = document.querySelector('.score-value')
const scoreFinal = document.querySelector('.score-final')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

const randomColor = () => {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)
  return `rgb(${red}, ${green}, ${blue})`
}

let snake = [
  { x: 240, y: 240 },
  { x: 270, y: 240 }
];

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

const drawSnake = () => {
  ctx.fillStyle = "#ddd";
  snake.forEach((position, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = "lightBlue";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += size) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];
  snake.shift(); //Remove a primeira posição de uma array

  if (direction === "right") {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction === "left") {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction === "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction === "up") {
    snake.push({ x: head.x, y: head.y - size });
  }
};

const drawFood = () => {
  const {x, y, color} = food
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0
}

const checkEat = () => {
  const head = snake[snake.length - 1]
  const endSnake = snake[0]

  if(head.x === food.x && head.y === food.y) {
    snake.unshift(endSnake)
    audio.play()
    incrementoScore()

    let x = randomPosition()
    let y = randomPosition()
    
    while(snake.find((position) => position.x === x && position.y === y)) {
      x = randomPosition()
      y = randomPosition()
    }

      food.x = x
      food.y = y
      food.color = randomColor()
  }
}

const incrementoScore = () => {
  score.innerText = +score.innerText + 1
}

const checkCollision = () => {
  const head = snake[snake.length - 1]
  const limit = canvas.width - size

  const wallCollision = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit
  const selfCollision = snake.find((position, index) => {
      return index < snake.length - 1 && position.x === head.x && position.y === head.y
  })

  if(wallCollision || selfCollision) {
   gameOver()
  }
}

const gameOver = () => {
  direction = undefined
  document.removeEventListener("keydown", handleClick);
  menu.style.display = 'flex'
  scoreFinal.innerText = 'Score: ' + score.innerText
  canvas.style.filter = 'blur(5px)'
}

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600); //Limpar a tela para que os desenhos sejam refeitos
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, 100);
};
gameLoop();

function handleClick(e) {
  if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
  if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  }
  if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
  if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  }
}

document.addEventListener("keydown", handleClick);

buttonPlay.addEventListener('click', () => {
  score.innerText = '00'
  menu.style.display = 'none'
  canvas.style.filter = 'none'
  snake = [{ x: 240, y: 240 }, { x: 270, y: 240 }];
  document.addEventListener("keydown", handleClick);
})
