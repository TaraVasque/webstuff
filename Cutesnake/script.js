const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = generateFood();

let score = 0;
let direction;
let gameSpeed = 100;

const bgMusic = document.getElementById('bgMusic');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

document.addEventListener('keydown', setDirection);
document.getElementById('difficulty').addEventListener('change', setDifficulty);
document.getElementById('sound').addEventListener('change', toggleSound);

function setDirection(event) {
    if (event.keyCode == 37 && direction != 'RIGHT') direction = 'LEFT';
    else if (event.keyCode == 38 && direction != 'DOWN') direction = 'UP';
    else if (event.keyCode == 39 && direction != 'LEFT') direction = 'RIGHT';
    else if (event.keyCode == 40 && direction != 'UP') direction = 'DOWN';
}

function setDifficulty(event) {
    gameSpeed = parseInt(event.target.value);
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
}

function toggleSound(event) {
    if (event.target.checked) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

function generateFood() {
    let foodX, foodY;
    let isOnSnake;
    do {
        isOnSnake = false;
        foodX = Math.floor(Math.random() * 18 + 1) * box;
        foodY = Math.floor(Math.random() * 18 + 1) * box;

        for (let i = 0; i < snake.length; i++) {
            if (foodX == snake[i].x && foodY == snake[i].y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake || foodX <= 0 || foodY <= 0 || foodX >= canvas.width - box || foodY >= canvas.height - box);
    return { x: foodX, y: foodY };
}

function draw() {
    ctx.fillStyle = '#fff0f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? '#ff69b4' : '#ffb6c1';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#fff';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#ff6347';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == 'LEFT') snakeX -= box;
    if (direction == 'UP') snakeY -= box;
    if (direction == 'RIGHT') snakeX += box;
    if (direction == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFood();
        if (document.getElementById('sound').checked) {
            eatSound.play();
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with the pink outer area head-on
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        if (document.getElementById('sound').checked) {
            gameOverSound.play();
        }
    }

    snake.unshift(newHead);

    ctx.fillStyle = '#000';
    ctx.font = '20px Comic Sans MS';
    ctx.fillText('Score: ' + score, 5, canvas.height - 5);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, gameSpeed);
bgMusic.play();