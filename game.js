const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;

// Paddles and ball
let leftPaddle = { x: 10, y: HEIGHT / 2 - PADDLE_HEIGHT / 2 };
let rightPaddle = { x: WIDTH - PADDLE_WIDTH - 10, y: HEIGHT / 2 - PADDLE_HEIGHT / 2 };
let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Score
let leftScore = 0;
let rightScore = 0;

// Mouse event for player paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within canvas
  leftPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddle.y));
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  for (let i = 15; i < HEIGHT; i += 30) {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, i);
    ctx.lineTo(WIDTH / 2, i + 15);
    ctx.stroke();
  }
}

function drawScore() {
  ctx.font = '40px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(leftScore, WIDTH / 4, 60);
  ctx.fillText(rightScore, WIDTH * 3 / 4, 60);
}

function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function updateAI() {
  // Simple AI: move paddle toward ball
  const target = ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
  if (rightPaddle.y < target) {
    rightPaddle.y += PADDLE_SPEED;
  } else if (rightPaddle.y > target) {
    rightPaddle.y -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  rightPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddle.y));
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y <= 0) {
    ball.y = 0;
    ball.vy *= -1;
  }
  if (ball.y + BALL_SIZE >= HEIGHT) {
    ball.y = HEIGHT - BALL_SIZE;
    ball.vy *= -1;
  }

  // Left paddle collision
  if (
    ball.x <= leftPaddle.x + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > leftPaddle.y &&
    ball.y < leftPaddle.y + PADDLE_HEIGHT
  ) {
    ball.x = leftPaddle.x + PADDLE_WIDTH;
    ball.vx *= -1.05; // Add a bit of speed
    // Add a bit of randomness
    ball.vy += (Math.random() - 0.5) * 2;
  }

  // Right paddle collision
  if (
    ball.x + BALL_SIZE >= rightPaddle.x &&
    ball.y + BALL_SIZE > rightPaddle.y &&
    ball.y < rightPaddle.y + PADDLE_HEIGHT
  ) {
    ball.x = rightPaddle.x - BALL_SIZE;
    ball.vx *= -1.05;
    ball.vy += (Math.random() - 0.5) * 2;
  }

  // Left wall (AI scores)
  if (ball.x <= 0) {
    rightScore++;
    resetBall();
  }

  // Right wall (player scores)
  if (ball.x + BALL_SIZE >= WIDTH) {
    leftScore++;
    resetBall();
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawNet();
  drawRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#1e90ff');
  drawRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#ff6347');
  drawBall(ball.x, ball.y, BALL_SIZE, '#fff');
  drawScore();
}

function gameLoop() {
  updateAI();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();
