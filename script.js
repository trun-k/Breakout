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

// Values which can be changed upon level -> speed, bricks and score
let speedBump = 0.2;
let starterSpeed = 2;

// score and lives
let score = 0;
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
for(let i=0;i<brickRows;i++){
    bricks[i] = [];
    for(let j=0;j<brickColumns;j++){
        bricks[i][j] = {x:0, y:0, visible:true};
    }
}


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
    brickSetUp();
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
                    score++;
                    if(score===brickRows*brickColumns){
                        alert("You win!");
                        document.location.reload();
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
    context.fillText(`Score: ${score*level}`, 8, 20);
}


// show lives
function drawLives(){
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


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

draw();