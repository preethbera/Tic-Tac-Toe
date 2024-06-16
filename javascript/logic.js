// -------------------------reset button js--------------------------------------------

const resetbtn = document.querySelector('#bodyreset');
const modalresetbtn = document.querySelector('#modalreset');
const modalcancelbtn = document.querySelector('#modalcancel');
resetbtn.addEventListener('click', () => {
    document.querySelector('.modalcontainer').style.display = 'flex';
});
modalcancelbtn.addEventListener('click', () => {
    document.querySelector('.modalcontainer').style.display = 'none';
});
modalresetbtn.addEventListener('click', () => {
    resetGame();
    document.querySelector('.modalcontainer').style.display = 'none';
});
// -----------------score resetbtn js-----------------------------------------------------
const scoreresetbtn = document.querySelector('#scorereset');
scoreresetbtn.addEventListener('click', () => {
    localStorage.setItem('oscore', 0);
    localStorage.setItem('xscore', 0);
    document.querySelector('#oscore').innerText = localStorage.getItem('oscore');
    document.querySelector('#xscore').innerText = localStorage.getItem('xscore');
    highlightplayer();
});
// ----------------change name btn and its modal js-------------------------------------
const changenamebtn = document.querySelector('#changename');
changenamebtn.addEventListener('click', () => {
    document.querySelector('.namemodalcontainer').style.display = 'flex';
});
const inputmodalcancel = document.querySelector('#inputmodalcancel');
inputmodalcancel.addEventListener('click', () => {
    document.querySelector('.namemodalcontainer').style.display = 'none';
});
const okbtn = document.querySelector('#okbtn');
let player1 = 'O';
let player2 = 'Computer(X)';
okbtn.addEventListener('click', () => {
    if ((document.querySelector('#player1').value != '') && (document.querySelector('#player2').value != '')) {
        player1 = document.querySelector('#player1').value;
        player2 = document.querySelector('#player2').value;
        document.querySelector('#player1span').innerText = player1;
        document.querySelector('#player2span').innerText = player2;
    }
    document.querySelector('.namemodalcontainer').style.display = 'none';
});
//--------------------------determining board size------------------------------------------

const boardsizeselect = document.querySelector('#nxnbtn');
let boardsize = 3;
boardsizeselect.addEventListener('change', () => {
    boardsize = Number(boardsizeselect.value);
    resetGame();
    game();
});
//----------------------determining the mode(solo or 1v1)------------------------------------------
let soloMode = true; // variable that checks whether solo mode is on or not
const modeselect = document.querySelector('#modeselect');
modeselect.addEventListener('change', () => {
    if(modeselect.value == 'true'){
        soloMode = true;
        player2 = 'Computer(X)'
        document.querySelector('#player2span').innerText = player2;
    }
    else {
        soloMode = false;
        if(document.querySelector('#player2').value != ''){
            player2 = document.querySelector('#player2').value;
        }
        else{
            player2 = 'X';  
            document.querySelector('#player2span').innerText = 'Player ' + player2; 
        }
    }
    resetGame();
    game();
});
//------------------------game logic------------------------------------------------------

// possible win conditions for different boards stored in arrays
let x3win = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let x4win = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [0, 5, 10, 15], [3, 6, 9, 12]];
let x5win = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];

let winChoices = x3win; // variable to store the win possibility according to the board size
let lastboardsize = '.x3'; // variable to store previous board size
let boxes;
let p1score; 
let p2score;
let availablechoices;
let turn = true; //variable to determine the players's turn, ture is for o's turn
let count = 0; // this variable is used so that in player gets first turn in alternate
// -----------------------to store data in local storage--------------------------------------
if ((localStorage.getItem('oscore') == null) && (localStorage.getItem('xscore') == null)) {
    localStorage.setItem('oscore', 0);
    localStorage.setItem('xscore', 0);
}
document.querySelector('#oscore').innerText = localStorage.getItem('oscore');
document.querySelector('#xscore').innerText = localStorage.getItem('xscore');

//------function when board sizes are changed-------------------------------------------
function boardchoice() {
    if (boardsize === 3) {
        winChoices = x3win;
        boxes = document.querySelector('.x3').querySelectorAll('.oxbox');
        document.querySelector(lastboardsize).classList.remove('afterselected');
        document.querySelector('.x3').classList.add('afterselected');
        lastboardsize = '.x3';
    }
    else if (boardsize === 4) {
        winChoices = x4win;
        boxes = document.querySelector('.x4').querySelectorAll('.oxbox');
        document.querySelector(lastboardsize).classList.remove('afterselected');
        document.querySelector('.x4').classList.add('afterselected');
        lastboardsize = '.x4';
    }
    else if (boardsize === 5) {
        winChoices = x5win;
        boxes = document.querySelector('.x5').querySelectorAll('.oxbox');
        document.querySelector(lastboardsize).classList.remove('afterselected');
        document.querySelector('.x5').classList.add('afterselected');
        lastboardsize = '.x5';
    }

}
// ------------function to check win condition-----------------------------------------
function checkWin(player) {
    for (let i = 0; i < (winChoices.length); i++) {
        if (boardsize === 3) {
            if ((boxes[winChoices[i][0]].dataset.value === player) && (boxes[winChoices[i][1]].dataset.value === player) && (boxes[winChoices[i][2]].dataset.value === player)) {
                return true;
            }
        }
        else if (boardsize === 4) {
            if ((boxes[winChoices[i][0]].dataset.value === player) && (boxes[winChoices[i][1]].dataset.value === player) && (boxes[winChoices[i][2]].dataset.value === player) && (boxes[winChoices[i][3]].dataset.value === player)) {
                return true;
            }
        }
        else if (boardsize === 5) {
            if ((boxes[winChoices[i][0]].dataset.value === player) && (boxes[winChoices[i][1]].dataset.value === player) && (boxes[winChoices[i][2]].dataset.value === player) && (boxes[winChoices[i][3]].dataset.value === player) && (boxes[winChoices[i][4]].dataset.value === player)) {
                return true;
            }
        }
    }
    for(let j = 0; j<boxes.length;j++){
        if(boxes[j].dataset.value == ''){
            return false;
        }
    }
    return 'draw';
}
// ------------------function to tell what to do when clicked---------------------------
function handleclick(event) {
    if (turn === true) {
        event.target.querySelector('.svgO').classList.add('svgafterclick');
        turn = !turn;
        showTurn(player2);
        event.target.dataset.value = 'O';
        if (checkWin('O') === true) {
            updateScore('oscore');
            highlightplayer();
            document.querySelector('.showturn').innerText = player1 + ' WON!';
            removeClickiEventListner();
            setTimeout(resetGame, 5000);
        }
        else if(checkWin('O')==='draw'){
            document.querySelector('.showturn').innerText = 'DRAW!!';
            removeClickiEventListner();
            setTimeout(resetGame, 5000);
        }
        event.target.removeEventListener('click', handleclick);
        if(soloMode===true){
            setTimeout(solomode,500);
        }
    }
    else {
        event.target.querySelector('.svgX').classList.add('svgafterclick');
        turn = !turn;
        showTurn(player1);
        event.target.dataset.value = 'X';
        if (checkWin('X') === true) {
            updateScore('xscore');
            highlightplayer();
            document.querySelector('.showturn').innerText = player2 + ' WON!';
            removeClickiEventListner();
            setTimeout(resetGame, 5000);
        }
        else if(checkWin('X')==='draw'){
            document.querySelector('.showturn').innerText = 'DRAW!!';
            removeClickiEventListner();
            setTimeout(resetGame, 5000);
        }
        event.target.removeEventListener('click', handleclick);
    }
}
// ----------------------function to add click event-----------------------------------------
function addClickiEventListner() {
    boxes.forEach(box => {
        box.addEventListener('click', handleclick);
    });
}
// ------------------function to remove click event---------------------------------------
function removeClickiEventListner() {
    boxes.forEach(box => {
        box.removeEventListener('click', handleclick);
    });
}
// -----------------funtion to reset board when the game is over-----------------------
function resetGame() {
    boxes.forEach(box => {
        box.querySelector('.svgX').classList.remove('svgafterclick');
        box.querySelector('.svgO').classList.remove('svgafterclick');
        box.dataset.value = '';
    });
    game();
}
// -----------------funtion that updates score-----------------------------------------
function updateScore(player) {
    localStorage.setItem(player, (Number(localStorage.getItem(player)) + 1));
    document.querySelector(String('#' + player)).innerText = localStorage.getItem(player);
}
//----------------function to show turn------------------------------------------------
function showTurn(player) {
    document.querySelector('.showturn').innerText = player + "'s Turn";
}
//---------------function that initiates game-------------------------------------------------------
function game() {
    changeTurn();
    boardchoice();
    addClickiEventListner();
    if(soloMode===true){
        setTimeout(solomode,100);
    }
}
// -----------------function to change turn alternately-------------------------------------------
function changeTurn(){
    count++;
    if((count%2)==1){
        turn = true;
        document.querySelector('.showturn').innerText = 'New game started '+player1+"'s turn";
    }
    else{
        turn = false;
        document.querySelector('.showturn').innerText = 'New game started '+player2+"'s turn";
    }
}
// ------------------function to highlight player---------------------------------------------------
function highlightplayer(){
    p1score = Number(localStorage.getItem('oscore'));
    p2score = Number(localStorage.getItem('xscore'));
    if(p1score>p2score){
        document.querySelector('.p1score').style.backgroundColor = 'rgb(84, 166, 234)';
    }
    else if(p1score<p2score){
        document.querySelector('.p2score').style.backgroundColor = 'rgb(84, 166, 234)';
    }
    else if(p1score==p2score){
        document.querySelector('.p1score').style.backgroundColor = 'rgb(39, 132, 208)';
        document.querySelector('.p2score').style.backgroundColor = 'rgb(39, 132, 208)';
    }
}
//--------------function to generate solomode choices------------------------------------------------
function solomode() {
    if(turn == false){
    availablechoices = Array.from(boxes).filter(box => (box.dataset.value == ''));
    let choicebycomp = Math.floor(Math.random() * (availablechoices.length));
    availablechoices[choicebycomp].dataset.value = 'X';
    availablechoices[choicebycomp].click();
    }
}
// -------------------------when the page loaded game must be called one time---------------------------------
game();
highlightplayer();

