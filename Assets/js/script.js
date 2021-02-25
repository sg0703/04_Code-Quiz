// Homework for Web API's 
// Started 2-23-21

// to do: go back and delete redundant display buttons code, remove from HTML...write entire page with JS

/**********SET GLOBAL VARIABLES ***********/
// get header container, put in variable for readability
var contentHeader = document.getElementById("content_header");
// get content container, put in variable for readability
var content = document.getElementById("content");
var buttonDiv = document.getElementById("button");

// get answerResult div, put in variable 
var answerResult = document.getElementById("answerResult");
var timerDisplay = document.getElementById("timer");

var qNumber;
var gameClock;
let gameTimer;

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
    gameClock = 75;
    qNumber = 0;
    clearInterval(gameTimer);

    // display start page
    contentHeader.innerHTML = "Coding Quiz Challenge";
    content.innerHTML = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/times by ten seconds!";
    timerDisplay.innerHTML = gameClock;

    // create start button
    var buttonDiv = document.getElementById("button");
    var startButton = document.createElement("button");
    startButton.innerHTML = "Start the quiz!";
    buttonDiv.appendChild(startButton);
  
    // If start button is pressed, start the game and hide the button
    startButton.addEventListener("click",function() {
        // start clock
        startClock();
        // display questions
        displayQuestions(questionsAnswers);
        // make button disappear
        startButton.setAttribute("style","display:none");
    });
}

// function to start game clock
function startClock() {
    // set timer using global variable x, so I can access from gameOver()
    gameTimer = setInterval(function() {
        console.log("In start clock, gameClock is "+gameClock);
        gameClock--;
        // end game if it times out, otherwise continue to play
        if (gameClock === 0) {
            timerDisplay.innerHTML = 0;
            gameOver();
            clearInterval(gameTimer);
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
                // display right/wrong message in hidden div, make visible
                answerResult.setAttribute("style","display:all");
                answerResult.innerHTML = "Correct!";
            }
            else {
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
    clearInterval(gameTimer);
    gameOver = 0;

    contentHeader.innerHTML = "All done!";
    content.innerHTML ='Your final score is: ' + gameClock + '<br>Enter initials: ';

    // create input box to store initials
    var nameBox = document.createElement("input");
    nameBox.setAttribute("type","text");
    nameBox.setAttribute("style","margin-top: 15px;");
    nameBox.addEventListener("focus",function() {
        answerResult.setAttribute("style","display:none;");
        nameBox.setAttribute("style","background: lightgray;");
    });
    content.appendChild(nameBox);

    // create new button for this specific task
    var newButton = document.createElement("button");
    newButton.innerHTML = "Save initials";
    newButton.setAttribute("style","margin-left: 5px;");
    content.appendChild(newButton);
    
    // when user saves 
    newButton.addEventListener("click",function() {
        if (!nameBox.value) {
            alert("Please input your initials!");
        }
        else {
            // add score to local storage
            addScore(nameBox.value,gameClock);
            // show user list of high scores saved
            displayScores();
        }
    });
}

function addScore(name,score) {
    // create object for new score that was passed to function
    newScore =
    {
        name: name,
        score: score
    };

    // if no existing scores in localstorage...then add it, otherwise
    if (!localStorage.getItem("codeQuizScores")) {
        // push newScore object into array, then
        var newScoreArray = [];    
        newScoreArray.push(newScore);
        // write it to local storage
        localStorage.setItem("codeQuizScores",JSON.stringify(newScoreArray));
    }
    else {
        // place existing scores in oldScoreArray
        var oldScoreArray = JSON.parse(localStorage.getItem("codeQuizScores"));
        // push newScore object into oldScoreArray
        oldScoreArray.push(newScore);
        // write updated scores to localStorage
        localStorage.setItem("codeQuizScores",JSON.stringify(oldScoreArray));
    }
}

// function to display high scores
function displayScores() {
    contentHeader.innerHTML = "Here are the high scores: ";
    content.innerHTML = ""; // reset innerHTML

    if (!localStorage.getItem("codeQuizScores")) {
        content.innerHTML = "No scores yet! Play the game!";
    }
    else {
        // use same variable name as in addScore for readability
        var oldScoreArray = JSON.parse(localStorage.getItem("codeQuizScores"));

        var scoreList = document.createElement("ul");
        
        // get all of the old scores, display in list
        for (i = 0; i < oldScoreArray.length; i++) {
            var scoreItem = document.createElement("li");
            scoreItem.innerHTML = (i+1) + ". " + oldScoreArray[i].name + ": " + oldScoreArray[i].score;
            scoreItem.setAttribute("id","score"+i);
            scoreList.appendChild(scoreItem);
            content.appendChild(scoreList);
        }
    }
       // display buttons to clear scores or go back to start of quiz

       var goBackBtn = document.createElement("button");
       goBackBtn.innerHTML = "Go back";
       goBackBtn.setAttribute("style","margin-right: 5px;");
       button.appendChild(goBackBtn);

       var clearScoresBtn = document.createElement("button");
       clearScoresBtn.innerHTML = "Clear High Scores";
       button.appendChild(clearScoresBtn);

       // add event listeners to these buttons, handle accordingly
       var qNumber = 0;
       var gameClock = 75;  
       console.log("THIS SHOULD BE 75" + gameClock);

       goBackBtn.addEventListener("click", function() { 
           // reload the page, starting over
           location.reload();
       });

       clearScoresBtn.addEventListener("click", function() {
           localStorage.removeItem("codeQuizScores");
           contentHeader.innerHTML = "Here are the high scores: ";
           content.innerHTML = "Cleared high scores. Now go play again!";
           return displayScores;
       });
}