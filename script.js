const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

/*

context.rect(20, 40, 100, 50);  -> 20, 40 is the starting/top-left point, where we make a rectangle of 100 pixels wide and 50 pixels tall.

context.arc(240, 160, 20, 0, Math.PI*2, false); -> 240, 160 is the centre of the arc, with 20 being the radius, and 0-2*pi being the angle for which we are drawing. False to denote it is anti-clockwise, else it would have been true.

ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";   -> for outlining
context.fillStyle = "#FF0000";              -> filling the color

*/

// making level
let level = 1;

// speeds
let speedBump = 0.2;
let starterSpeed = 2;

// score and lives
let score = 0;
let cleared = 0;
let lives = 3;


// speed of ball and paddle
let dx = starterSpeed;
let dy = -starterSpeed;
let paddleDif = 7;


// paddle characteristics
let paddleHeight = 10;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth)/2;

// ball characteristics
let radius = 10;
let x = canvas.width/2;
let y = canvas.height - (radius + paddleHeight);


// brick field characteristics
let bricks = [];
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffSetTop = 30;
let brickOffSetLeft = 30;
let brickRows = 8;
let brickColumns = 8;
let target = brickRows*brickColumns;
for(let i=0;i<brickRows;i++){
    bricks[i] = [];
    for(let j=0;j<brickColumns;j++){
        bricks[i][j] = {x:0, y:0, visible:true};
    }
}

// audios
let paddleHitAudio;
let gameOver;
let levelUp;

// controls
let leftPressed = false;
let rightPressed = false;


// event listeners for key pressed
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


// key down
function keyDownHandler(event){
    if(event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = true;
    }else if(event.key === "Right" || event.key === "ArrowRight"){
        rightPressed = true;
    }
}


// key up
function keyUpHandler(event){
    if(event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = false;
    }else if(event.key === "Right" || event.key === "ArrowRight"){
        rightPressed = false;
    }
}


// draw ball
function drawBall(){
    context.beginPath(); 
    context.arc(x, y, radius, 0, Math.PI*2, false);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}


// draw paddle
function drawPaddle(){
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}


// draw bricks
function drawBricks(){
    for(let i=0; i<brickRows; i++){
        for(let j=0;j<brickColumns; j++){
            if(bricks[i][j].visible===true){
                let brickX = brickOffSetLeft + j*(brickWidth + brickPadding);
                let brickY = brickOffSetTop + i*(brickHeight + brickPadding);
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}


// ball hitting the bricks
function collision(){
    for(let i=0; i<brickRows; i++){
        for(let j=0; j<brickColumns; j++){
            let brick = bricks[i][j];
            if(brick.visible===true){
                if(x >= brick.x -radius && x <= brick.x + brickWidth + radius && y >= brick.y - radius && y <= brick.y + brickHeight + radius){
                    dy = -dy;
                    brick.visible = false;
                    score += level;
                    cleared++;
                    if(cleared===target){
                        nextLevel();
                        x = canvas.width/2;
                        y = canvas.height - (radius + paddleHeight);
                        paddleX = (canvas.width - paddleWidth)/2;
                    }
                }
            }
        }
    }
}


// show score
function drawScore(){
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(`Score: ${score}     Level: ${level}`, 8, 20);
}


// show lives
function drawLives(){
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


// handles when level changes
function nextLevel(){
    level++;
    levelUp.play();
    cleared = 0;
    grids = ["standard", "standard2", "checkerboard", "checkerboard2", "window", "rows", "full"];
    brickSetUp(grids[Math.floor(Math.random()* grids.length)]);
}


// handles various brick layout
function brickSetUp(grid){
    target = 0;
    brickRows = 8;
    console.log(grid);
    switch (grid) {
        case "standard":
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    if(i<5){
                        bricks[i][j].visible = true;
                        target++;
                    }else{
                        bricks[i][j].visible = false;
                    }
                }
            }
            break;
        case "standard2":
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    if(i<6){
                        bricks[i][j].visible = true;
                        target++;
                    }else{
                        bricks[i][j].visible = false;
                    }
                }
            }
            break;
        case "checkerboard":
            flag = true;
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    bricks[i][j].visible = flag;
                    if(flag){
                        target++;
                    }
                    flag = !flag;
                }
            }
            break;
        case "checkerboard2":
            flag = false;
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    bricks[i][j].visible = flag;
                    if(flag){
                        target++;
                    }
                    flag = !flag;
                }
            }
            break;
        case "rows":
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    if(i%2==0){
                        bricks[i][j].visible = true;
                        target++;
                    }else{
                        bricks[i][j].visible = false;
                    }
                }
            }
            break;
        case "window":
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    if(i%2!=0 && j%2!=0){
                        bricks[i][j].visible = false;
                    }else{
                        bricks[i][j].visible = true;
                        target++;
                    }
                }
            }
            break;
        case "full":
            for(let i=0;i<brickRows;i++){
                for(let j=0;j<brickColumns;j++){
                    bricks[i][j].visible = true;
                    target++;
                }
            }
            break;
        default:
            for(let i=0;i<5;i++){
                for(let j=0;j<brickColumns;j++){
                    bricks[i][j].visible = true;
                    target++;
                }
            }
            break;
    }
}


// create an audio element and use it for sound
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// main function drawing on the canvas
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);   // clears previous canvas, so there is no trail of ball
    drawBall();
    drawPaddle();
    collision();
    drawBricks();
    drawScore();
    drawLives();
    if(x + dx - radius < 0 || x + dx + radius > canvas.width){
        dx = -dx;
    }
    if(y + dy - radius < 0){
        dy = -dy;
    }else if(y + dy + radius > canvas.height-paddleHeight){
        if(paddleX - radius < x && paddleX + paddleWidth + radius > x){
            paddleHitAudio.play();
            dy = -dy;
            dy -= speedBump;
            if(dx < 0){
                dx -= speedBump;
            }else{
                dx += speedBump;
            }
        }else{
            lives--;
            if(lives===0){
                gameOver.play();
                alert("Game over, you lost!");
                document.location.reload();
            }else{
                x = canvas.width/2;
                y = canvas.height - (radius + paddleHeight);
                paddleX = (canvas.width - paddleWidth)/2;
                dx = starterSpeed;
                dy = -starterSpeed;
            }
        }
    }
    x += dx;
    y += dy;
    if(leftPressed){
        paddleX = Math.max(0, paddleX-paddleDif);
    }else if(rightPressed){
        paddleX = Math.min(paddleX + paddleDif, canvas.width - paddleWidth);
    }
    requestAnimationFrame(draw);
}


function setup(){
    brickSetUp("standard");
    paddleHitAudio = new sound("audio/paddle_hit.mp3");
    gameOver = new sound("audio/game_over.mp3");
    levelUp = new sound("audio/level_up.mp3");
    draw();
}

setup();