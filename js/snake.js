const gameBoard = document.getElementById("gameCanvas");

let context = gameBoard.getContext("2d");

let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;

// define variable names
let boardBackgroundColor = "black";
let snakeColor = "green";
let snakeBorderColor = "darkgreen";
let foodColor = "red";

// draw canvas background
context.fillStyle = boardBackgroundColor;
context.fillRect(0, 0, gameWidth, gameHeight);

const initSize = 20; // Size of each grid unit in pixels
let score = 0; // Initialize score

let xVelocity = initSize; // Initial horizontal velocity
let yVelocity = 0; // Initial vertical velocity

let isRunning = false; // Flag to check if the game is running

let foodX; // X-coordinate of the food
let foodY; // Y-coordinate of the food
let gameSpeed = 300; // Initial speed of the game in milliseconds

/**
 Sa e kote koulev lan ki gen 5 segman, kò a kòmanse nan pozisyon (0, 40) epi gen de segman ki swiv li. Chak segman reprezante yon pati nan kò a, ak premye segman an se tèt la.
*/
let snake = [
    { x: initSize * 4, y: 40 },
    { x: initSize * 3, y: 40 },
    { x: initSize * 2, y: 40 },
    { x: initSize, y: 40 },
    { x: 0, y: 40 }
];

/**  
  vitès mouvman kò a, ki se kantite segman ke kò a ap deplase chak fwa li avanse.Vitès la ka ajiste pou fè jwèt la pi  fasil oswa pi difisil, epi li ka ogmante pandan jwèt la ap pwogrese pou ajoute yon defi siplemantè.
*/
window.addEventListener("keydown", changeDirection);

window.addEventListener("click", resetGame); // KOLO 

function gameStart() {
    isRunning = true;
    createFood();
    drawFood();
    // handle score hereh
    nextTick();
}

// use setTimeout to create a game loop that updates the game state and renders the game at regular intervals. The nextTick function will be called repeatedly to keep the game running until the game is over.
function nextTick() {
    if (isRunning) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            drawScore();

            drawSnake();
            moveSnake();
            checkGameOver();
            nextTick();
        }, gameSpeed);
    } else {
        displayGameOver();
    }
}

// createFood se yon fonksyon ki jere pozisyon manje a sou tablo jwèt la. Li itilize yon fonksyon anndan pou jenere yon pozisyon o aza ki aliyen ak griy la,
function createFood() {
    function randomFoodPosition(min, max) {
        return Math.round((Math.random() * (max - min) + min) / initSize) * initSize;
    }
    foodX = randomFoodPosition(0, gameWidth - initSize);
    foodY = randomFoodPosition(0, gameHeight - initSize);
}

// drawFood se yon fonksyon ki responsab pou desen manje a sou tablo jwèt la. Li itilize metòd fillRect nan konteks 2D pou kreye yon kare wouj ki reprezante manje a, ak pozisyon li detèmine pa foodX ak foodY.
function drawFood() {
    // draw the food on the game context
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, initSize, initSize);
}

// drawSnake se yon fonksyon ki responsab pou desen kò a sou tablo jwèt la. Li itilize yon bouk pou iterasyon sou chak pati nan kò a, desen yon rektang pou chak segman, ak pozisyon li detèmine pa pwopriyete x ak y nan chak objè nan tab snake la.
function drawSnake() {
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorderColor;

    snake.forEach((snakePart) => {
        context.fillRect(snakePart.x, snakePart.y, initSize, initSize);
        context.strokeRect(snakePart.x, snakePart.y, initSize, initSize);
    });
    console.log(`snake lenght`, snake.length);
}

// Step - by - step explanation
// Adding a new head:
// Each time the snake moves, a new head segment is added to the front of the snake array:
// 
// Checking for food collision:
// If the new head's position matches the food's position, the snake has "eaten" the food:
// 
// Growing the snake:
// 
// If food is eaten: The snake.pop() line is skipped, so the new head is added but nothing is removed.This increases the snake's length by 1.
// If no food is eaten: The last segment is removed(snake.pop()), so the length stays the same.


function moveSnake() {
    // Calculate new head position based on current direction
    const currentHead = snake[0];
    const newHead = {
        x: currentHead.x + xVelocity,
        y: currentHead.y + yVelocity
    };

    // Add the new head to the front of the snake array
    snake.unshift(newHead);

    // Check if the snake's head is on the food
    const hasEatenFood = (newHead.x === foodX && newHead.y === foodY);

    if (hasEatenFood) {
        // Snake eats the food: increase score and generate new food
        score += 1;
        createFood();
        drawScore();

        // Augmenter le vitesse apres 3 pièce de manger 
        if (score % 3 === 0 && gameSpeed > 50) {
            gameSpeed -= 20; 
        }
        // Do not remove the tail, so the snake grows
    } else {
        // Snake did not eat food: remove the last segment to keep length the same
        snake.pop();
    }
}

function checkGameOver() { 
    if (isOutOfBoard() || isSelfcollision()){
        isRunning = false;
    }
}

function isOutOfBoard(){
    const head = snake[0];
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight){
        return true;
    }
    return false;
}

function isSelfcollision(){
    const head = snake[0];
    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
            return true;
        }
    }
    return false;
}

function resetGame() { 
    score = 0;
    xVelocity = initSize;
    yVelocity = 0;
    snake = [
        { x: initSize * 4, y: 40},
        { x: initSize * 3, y: 40},
        { x: initSize * 2, y: 40},
        { x: initSize , y: 40},
        { x: 0, y:40}
    ];
    gameStart();

}

function displayGameOver() { 
    context.font = "50px sans-serif";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("Game Over!", gameWidth / 2, gameHeight / 2);  

    const playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    playAgainButton.style.position = "absolute";
    playAgainButton.style.top = `${gameBoard.offsetTop + gameHeight + 20}px`;
    playAgainButton.style.left = `${gameBoard.offsetLeft + gameWidth / 2}px`;
    playAgainButton.style.transform = "translate(-50%, 0)";
    playAgainButton.style.padding = "10px 20px";
    playAgainButton.style.fontSize = "16px";

    document.body.appendChild(playAgainButton);

    playAgainButton.addEventListener("click", () => {
        document.body.removeChild(playAgainButton);
        resetGame();
    });
}

function drawScore() {
    // Clear only the score area
    context.fillStyle = boardBackgroundColor;
    context.fillRect(0, 0, gameWidth, 30); // Adjust height to cover the score area

    // Draw the score
    context.font = "20px sans-serif";
    context.fillStyle = "white";
    context.textAlign = "left";
    context.fillText("Score: " + score, 10, 20);
}

// Step - by - step explanation
// The changeDirection function is an event handler that listens for keydown events. When a key is pressed, it checks which arrow key was pressed and updates the snake's velocity accordingly, while also ensuring that the snake cannot reverse direction directly (e.g., if it's moving right, it cannot immediately move left). This is done by checking the current velocity and preventing changes that would cause the snake to move in the opposite direction of its current movement. For example, if the snake is currently moving right (positive xVelocity), pressing the left arrow key will not change the direction to left (negative xVelocity) because it would cause an immediate collision with itself.
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const goingUp = yVelocity === -initSize;
    const goingDown = yVelocity === initSize;
    const goingRight = xVelocity === initSize;
    const goingLeft = xVelocity === -initSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        xVelocity = -initSize;
        yVelocity = 0;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        xVelocity = initSize;
        yVelocity = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        xVelocity = 0;
        yVelocity = -initSize;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        xVelocity = 0;
        yVelocity = initSize;
    }
}

// clearBoard se yon fonksyon ki jere netwayaj tablo jwèt la anvan chak nouvo desen. Li itilize metòd fillRect nan konteks 2D pou ranpli tout tablo a ak koulè background, efase nenpòt desen anvan yo epi prepare espas pou desen nouvo eleman tankou kò a ak manje a.
function clearBoard() {
    // clear the game context
    context.fillStyle = boardBackgroundColor;
    context.fillRect(0, 0, gameWidth, gameHeight);
}

gameStart();