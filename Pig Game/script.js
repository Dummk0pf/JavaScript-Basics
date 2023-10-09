// Use getelementbyid and getelementbyclassname for better speeds

"use-strict";

const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const WIN_SCORE = 20;

const ngame = getObj("newgame");
const egame = getObj("endgame");
const roll = getObj("roll");
const hold = getObj("hold");
const image = getObj("dice");

const p_one = getObj("player1");
const p_two = getObj("player2");

const score1 = getObj("score1");
const score2 = getObj("score2");

const cscore1 = getObj("currentscore_1");
const cscore2 = getObj("currentscore_2");

const overlay = getObj("overlay");
const winbox = getObj("winbox");
const winmessage = getObj("winmessage");

let cplayer = PLAYER_ONE;

let pcscore1 = 0;
let pcscore2 = 0;

let totscore1 = 0;
let totscore2 = 0;

function getObj(object){
    return document.querySelector(`.${object}`);
}

function init(){
    cplayer = PLAYER_ONE;
    pcscore1 = 0;
    pcscore2 = 0;
    totscore1 = 0;
    totscore1 = 0;
}

function switchPlayer(player){
    const fromstate = player === PLAYER_ONE ? "white" : "grey";
    const toState = player === PLAYER_ONE ? "grey" : "white";
    
    // can use toggle instead of add and remove 

    p_one.classList.remove(fromstate);
    p_one.classList.add(toState);
    
    p_two.classList.remove(toState);
    p_two.classList.add(fromstate);

}

function winEvent(player){
    winmessage.textContent = `✨✨ PLAYER ${player} WINS !!!! ✨✨`;
    winbox.style.display = "block";
    overlay.style.display = "block";
}

const rollevent = function(){
    const number = Math.trunc(Math.random()*6)+1;
    image.src = `http://127.0.0.1:8080/res/dice-${number}.png`;
    if(cplayer === PLAYER_ONE){
        if(number === 1){
            pcscore1 = 0;
            cscore1.textContent = 0;
            switchPlayer(cplayer);
            cplayer = PLAYER_TWO;
        }
        else{
            pcscore1 += number;
            cscore1.textContent = pcscore1;
            if(pcscore1 >= WIN_SCORE){
                console.log("WON")
                winEvent(cplayer);
            }
        }
    }
    else if(cplayer === PLAYER_TWO){
        if(number === 1){
            pcscore2 = 0;
            cscore2.textContent = 0;
            switchPlayer(cplayer);
            cplayer = PLAYER_ONE;
        }
        else{
            pcscore2 += number;
            cscore2.textContent = pcscore2;
            if(pcscore2 >= WIN_SCORE){
                console.log("WON")
                winEvent(cplayer);
            }
        }
    }
}

const holdevent = function(){
    switchPlayer(cplayer);
    if(cplayer === PLAYER_ONE){
        totscore1 += pcscore1;
        score1.textContent = totscore1;
        cscore1.textContent = 0;
        pcscore1 = 0;
        if(pcscore1 >= WIN_SCORE){
            winEvent(cplayer);
        }
        else{
            cplayer = PLAYER_TWO;
        }
    }
    else if(cplayer == PLAYER_TWO){
        totscore2 += pcscore2;
        score2.textContent = totscore2;
        cscore2.textContent = 0;
        pcscore2 = 0;
        if(pcscore2 >= WIN_SCORE){
            winEvent(cplayer);
        }
        else{
            cplayer = PLAYER_ONE;
        }
    }
}

const ngameEvent = function(){
    init();
    switchPlayer(PLAYER_TWO);
    score1.textContent = 0;
    score2.textContent = 0;
    cscore1.textContent = 0;
    cscore2.textContent = 0;
    winbox.style.display = "none";
    overlay.style.display = "none";
}

roll.addEventListener('click', rollevent);

hold.addEventListener('click', holdevent);

ngame.addEventListener('click', ngameEvent);

egame.addEventListener('click', ngameEvent);