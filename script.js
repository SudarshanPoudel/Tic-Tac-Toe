// 3X3 grid container in html to build our board
let container = document.querySelector(".main-grid");

// Initial state of board
let board = [["", "", ""], ["", "", ""], ["", "", ""]];

// Some useful variables
let turn = "X"
let isGameOver = false;
let isSinglePlayer = true;

// Initial screen script to select GameMode as single or multi player
let modeBtns = document.querySelectorAll('.gameMode');
let blackBg = document.querySelector('.bg-black');
let popUp = document.querySelector('.popup');

modeBtns[0].addEventListener('click', ()=>{
    isSinglePlayer = false;
    popUp.style.top = "145%"
    blackBg.style.display = "none"
})
modeBtns[1].addEventListener('click', ()=>{
    isSinglePlayer = true;
    popUp.style.top = "145%"
    blackBg.style.display = "none"
})


// Function that generate and displays our board
displayBoard();
function displayBoard(){
    container.innerHTML = ""  //Reset container
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++){
            // Create boxes, give them class name to apply CSS, Value inside box from board
            let box = document.createElement("div"); 
            box.classList = ['box align'];
            box.innerHTML = board[i][j]
            if(box.innerHTML === "" && (!isSinglePlayer || turn == "X")){ //make box clickable only if it is empty and it is X's turn when it is Single player
                box.addEventListener('click', ()=>{
                    boxClicked(i, j);
                })
            }
            container.appendChild(box) //Append created box to container
        }
    }
}


// Function that is called when someone clicks the box (either user clicking it directly or AI doing it virtually)
function boxClicked(i, j){  //i and j are cordinates of the box clicked in container
    if(!isGameOver){ 
        board[i][j] = turn; 
        switchTurn();
        checkResult(board);
        displayBoard();
        if(checkResult(board) != null) displayResults();
    }
}

// Function that switch turn of O and X when called
function switchTurn(){
    if(turn === "X"){
        turn = "O"
        document.querySelector(".bg").style.left = "85px"

        //If it is single player, when switched to 'O''s turn it calles computerChoice function after 0.5 sec timeout
        if(isSinglePlayer){
            setTimeout(computerChoice, 500)
        }
    }
    else{
        turn = "X"
        document.querySelector(".bg").style.left = "0"
    }
}

//Function to check result of Board, returns 1 if 'X' wins, -1 if 'O' wins, 0 if draw and null if noone won
function checkResult(gameBoard){
    //Check Row and column
    for(let i = 0; i < 3; i++){
        if(gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2]){
            if(gameBoard[i][0] === "X") return 1;
            else if(gameBoard[i][0] === "O") return -1;
        }
        if(gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i]){
            if(gameBoard[0][i] === "X") return 1;
            else if(gameBoard[0][i] === "O") return -1;
        }
    }

    //Check Diagonals
    if((gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2]) || (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0])){
        if(gameBoard[1][1] === "X") return 1;
        if(gameBoard[1][1] === "O") return -1;
    }

    //Check for draw
    let isDraw = true;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(gameBoard[i][j] === "") isDraw = false;
        }
    }
    if(isDraw) return 0;
}


//Function to actually display the results
function displayResults(){
    if(checkResult(board) === 0) document.querySelector("#result").innerHTML = "Draw";
    else if(checkResult(board) == 1) document.querySelector("#result").innerHTML = "X won";
    else document.querySelector("#result").innerHTML = "O won"

    document.querySelector("#play-again").style.display = "inline";
    isGameOver = true;
}


// Minimax Algorithm starts here
//Function thats called when its turn for Computer to make choice
function computerChoice(){
    let bestValue = Infinity; //Since 'O' is minimizing Player
    let bestMove;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(board[i][j] === ""){  //Check if spot on the board is available
                board[i][j] = 'O' //Put 'O' in available spots
                let value = minimax(board, 0, true);  //callls Minimax function for score of that move
                board[i][j] = '' //Undo prev. move

                if(value < bestValue){
                    bestValue = value;
                    bestMove = {i, j}  //Save current move as best move if new score is less than prev.
                }
            }
        }
    }

    boxClicked(bestMove.i, bestMove.j) //AI Clicks the best Option among all available
}


//Minimax Function
function minimax(board, depth, isMaximizing){
    //If Game is over returns same value returned by checkResult function
    if(checkResult(board) != null){
        return checkResult(board);
    }

    //Similar as computerChoice function, Calls this function recursively for each possible moves while changing turns till it returns solid value of result.
    if(isMaximizing){
        let bestValue = -Infinity;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j] === ""){
                    board[i][j] = "X"
                    let value = minimax(board, depth + 1, false);
                    board[i][j] = ""
    
                    if(value > bestValue){
                        bestValue = value;
                    }
                }
            }
        }
        return bestValue;
    }
    else{
        let bestValue = Infinity;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j] === ""){
                    board[i][j] = "O"
                    let value = minimax(board, depth + 1, true);
                    board[i][j] = ""
    
                    if(value < bestValue){
                        bestValue = value;
                    }
                }
            }
        }
        return bestValue;
    }
}


//restart the game
document.querySelector("#play-again").addEventListener("click", ()=>{
    isGameOver = false;
    turn = "X"
    document.querySelector(".bg").style.left = "0"
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    board =  [["", "", ""], ["", "", ""], ["", "", ""]];
    displayBoard();
})