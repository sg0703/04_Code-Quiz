// Homework for Web API's 
// Started 2-23-21

/**********SET GLOBAL VARIABLES ***********/
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
// get header container, put in variable for readability
var contentHeader = document.getElementById("content_header");
// get content container, put in variable for readability
var content = document.getElementById("content");
// get answerResult div, put in variable 
var answerResult = document.getElementById("answerResult");
var timerDisplay = document.getElementById("timer");

var qNumber = 0;
var gameClock = 75;

var correct = 0;
var incorrect = 0;

var x;

// Store questions in an array of objects
var questionsAnswers = [
    {
        question: 'Commonly used data types DO NOT include:',
        answers: ['Strings','Booleans','Alerts','Numbers'],
        correct: 2
    },
    {
        question: 'Arrays in Javascript can be used to store:',
        answers: ['numbers and strings','other arrays','booleans','all of the above'],
        correct: 3
    },
    {
        question: 'String values must be enclosed within ______ when being assigned to variables.',
        answers: ['commas','curly brackets','quotes','parenthesis'],
        correct: 2
    },
    {
        question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
        answers: ['JavaScript','terminal/bash','for loops','console.log'],
        correct: 3
    }, 
    {
        question: 'Bonus question: which beats are best?',
        answers: ['Bears','Beats','Battlestar Galactica','Trick Question, Jim!'],
        correct: 3
    }
];

/*************DISPLAY INITIAL CONTENT ****************/
displayStart();

/*************FUNCTIONS BELOW CONTROL GAMEPLAY*************/

// function to display initial content.
function displayStart() {
    contentHeader.innerHTML = "Coding Quiz Challenge";
    content.innerHTML = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/times by ten seconds!";

    // show button
    buttonDisplay(true,false,"Start Quiz!");
  
    // If start button is pressed, start the game and hide the button
    button1.addEventListener("click",function() {
        // start clock
        startClock();
        // display questions
        displayQuestions(questionsAnswers);
        // make button disappear
        buttonDisplay(false,false);
    });
}

// simple function to show buttons, set message on them
function buttonDisplay(show1,show2,message1,message2) {
    if (show1) {
        button1.style["display"] = "all";
        button1.innerHTML = message1;
    }
    else {
        button1.style["display"] = "none";
    }

    if (show2) {
        button2.style["display"] = "all";
        button2.innerHTML = message2;
    }
    else {
        button2.style["display"] = "none";
    }
}

// function to start game clock
function startClock() {
    // set timer using global variable x, so I can access from gameOver()
    x = setInterval(function() {
        gameClock--;
        // end game if it times out, otherwise continue to play
        if (gameClock === 0) {
            timerDisplay.innerHTML = 0;
            clearInterval(x);
        }
        else {
            timerDisplay.innerHTML = gameClock;
        }
    },1000);
}

// function to display questions, accepts questionsAnswers array
function displayQuestions(questionsAnswers) {
    // dump current question into var for readability/my sanity
    var currentQ = questionsAnswers[qNumber];
    var list = document.createElement("ul");

    contentHeader.innerHTML = currentQ.question;
    content.innerHTML = '';// reset content box, then build list of answers

    for (i = 0; i < currentQ.answers.length; i++) {
        var listItem = document.createElement("li");

        // if creating correct answer LI, then add data to tag in HTML
        if (i === currentQ.correct) {
            listItem.setAttribute("data-correct","true");
        }
        else {
            listItem.setAttribute("data-correct","false");
        }
        listItem.setAttribute("id","list#"+i);
        listItem.style.cursor = "pointer";

        listItem.innerText = (i+1) + ". " + currentQ.answers[i];
        content.appendChild(list);
        list.appendChild(listItem);

        // add event listener to each list item...log clock and act accordingly
        document.getElementById("list#"+i).addEventListener("click",function() {
            if (this.getAttribute("data-correct") === "true") {
                correct++;
                // display right/wrong message in hidden div, make visible
                answerResult.setAttribute("style","display:all");
                answerResult.innerHTML = "Correct!";
            }
            else {
                incorrect++;
                gameClock -= 10;
                 // display right/wrong message in hidden div, make visible
                answerResult.setAttribute("style","display:all");
                answerResult.innerHTML = "Incorrect!";
            }

            if (qNumber < (questionsAnswers.length - 1)) { 
                qNumber++;
                return displayQuestions(questionsAnswers);
            }
            else {
                console.log("GAME OVER!");
                console.log(gameClock + " is your score!");
                gameOver();
            }
        });
    }
}

function gameOver() {
    timerDisplay.innerHTML = gameClock;

    clearInterval(x);
    gameOver = 0;

    contentHeader.innerHTML = "All done!";
    content.innerHTML ='Your final score is: ' + gameClock;
    

    console.log("IN GAME OVER FUNCTION");
}

// function to display high scores
function displayScores() {

}

// function to check answer

// 

// localstorage functions to store items

// function to clear stored scores

// ...

// use array + objects to group question, answer choices, and correctAnswer. access with questions.question

/*
var questions = [{
    question: '',
    answers: [''],
    correctAnswer

}]
*/