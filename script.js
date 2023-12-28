//getting the html elements
const board = document.getElementById("game-board");
const instructionText=document.getElementById("instruction-text");
const logo=document.getElementById("logo");
const score=document.getElementById("score");
const highScoreText=document.getElementById("highScore");

//game variables
const gridSize=20
let snake=[{x:15,y :10}];
let food=generateFood();
let direction ='up';
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;
let highScore=0;

//implementing the map,snake.foofd
function draw(){
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
    updateHighScore();
}

//drawing the snake
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
}


//creating snake & food
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element
}

//updating the position of the snake
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

function drawFood(){
   if(gameStarted){
    const foodElement=createGameElement('div','food') ;
    setPosition(foodElement,food);
    board.appendChild(foodElement);
   }
}

//to generate the position of food
function generateFood(){
    const x=Math.floor(Math.random() * gridSize)+1;
    const y=Math.floor(Math.random() * gridSize)+1;
    return {x,y};
}

//to navigate snake
function move(){
    const head={...snake[0]};
    switch(direction){
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'left':
            head.x--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    //snake.pop();
    if(head.x===food.x &&head.y===food.y){
        food=generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval=setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

//function for the start game
function startGame(){
    gameStarted=true;
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// starting the game using event
function handleKeyPress(event){
    if((!gameStarted && event.code==='Space')||(!gameStarted && event.code===' ')){
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    console.log(gameSpeedDelay);
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }
    else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }
    else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }
    else if(gameSpeedDelay>20){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
        resetGame();
    }
    for (let i=1;i<snake.length;i++){
       if(head.x=== snake[i].x && head.y===snake[i].y) {
            resetGame();
       }
    }

}

function resetGame(){
    snake=[{x:10,y:10}];
    direction='right';
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    const currentScore=snake.length-1;
    score.textContent=currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display='block';
    logo.style.display='block';

}

//function to upadte highscore
function updateHighScore(){
    const currentScore=snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString.padStart(3,'0');

    }
    highScoreText.style.display='block';
}