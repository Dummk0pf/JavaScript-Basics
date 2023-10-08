"use strict";

const rand = () => {
    const number = Math.round(Math.random()*20);
    if(number === 0)
    number++;
    return number;
}

function setText(object, string){
    document.querySelector(`.${object}`).textContent = string;
}

function init(){
    correctAnswer = rand();
    currentScore = 20;
}

let correctAnswer = rand();
let currentScore = 20;
console.log(correctAnswer);


document.querySelector('.checkbutton').addEventListener('click',
function(){
    const guess = Number(document.querySelector('#currentguess').value);
    console.log(guess ); 
    document.querySelector('#currentguess').value = '';

    if(isNaN(guess) || (guess < 1 || guess > 20)){
        setText("state", "Number = [1,20]");
        return;
    }
    
    if(currentScore <= 0){
        setText("state", "You Lose..");
        return;
    }
    
    if(correctAnswer === guess){
        setText("state", "Correct Guess🎇🎇");
        const highScore = Number(document.querySelector('.highscore').textContent);
        if(highScore < currentScore){
            setText("highscore", currentScore);
        }
        setText("currentscore", 20);
        setText("question-mark", correctAnswer);
        

        document.querySelector('body').style.backgroundColor = 'green';
        document.querySelector('.question-mark').style.width = '10rem';
        document.querySelector('.question-mark').style.textAlign = 'center';
        
        init();
        console.log(correctAnswer);
        
    }
    else {
        setText("state", guess < correctAnswer ? "too Low..." : "too High...");
        setText("currentscore", --currentScore);
    }
    
});

// document.querySelector('.button').addEventListener('click',anyfunction());
// 
// this does not work always give a function expression and then call the function
// 
// document.querySelector('.button').addEventListener('click',function(){
    // anyfunction();
    // });
    
document.querySelector('.button').addEventListener('click',
function (){
    console.log("Resetting");
    init();
    console.log(correctAnswer);
    setText("state", "Start-Guessing...");
    setText("currentscore", 20);
    setText("question-mark","?");
    
    document.querySelector('body').style.backgroundColor = 'rgb(36, 35, 35)';
    document.querySelector('.question-mark').style.width = 'fit-content';
});