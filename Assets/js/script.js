// Homework for Web API's - Code Quiz
// Started 2-23-21

/**************** to do: take out inline css, put it in stylesheet, use Id's. see if some repetitive code can be placed in functions...look for variables that are not used 
 * a few buttons are in content div, put them in button div 
*/

/************* Global variables **********/

// get elements in template HTML to build off of
var contentHeader = document.getElementById("content_header");
var content = document.getElementById("content");
var buttonDiv = document.getElementById("button");
var answerResult = document.getElementById("answerResult");
var timerDisplay = document.getElementById("timer");

// set variables to regulate gameplay across functions
var qNumber;
var gameClock;
var gameTimer;

// Store questions in an array of objects
var questionsAnswers = [
    {
        question: 'Commonly used data types DO NOT include:',
        answers: ['Strings','Booleans','Alerts','Numbers'],
        correct: 2
    },
    {
        question: 'Arrays in Javascript can be used to store:',
        answers: ['Numbers and strings','Other arrays','Booleans','All of the above'],
        correct: 3
    },
    {
        question: 'String values must be enclosed within ______ when being assigned to variables.',
        answers: ['Commas','Curly brackets','Quotes','Parenthesis'],
        correct: 2
    },
    {
        question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
        answers: ['JavaScript','Terminal/bash','For loops','Console.log'],
        correct: 3
    }, 
    {
        question: 'Bonus question: which beats are best?',
        answers: ['Bears','Beats','Battlestar Galactica','Trick Question, Jim!'],
        correct: 3
    }
];

/************* Display initial content for page ***********/

displayStart();

/************* Functions ************* */

// display welcome page 
function displayStart() {
    gameClock = 75;
    qNumber = 0;

    // insert content onto page
    contentHeader.innerHTML = "Coding Quiz Challenge";
    content.innerHTML = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/times by ten seconds!";
    timerDisplay.innerHTML = gameClock;

    // create start button
    var startButton = document.createElement("button");
    startButton.innerHTML = "Start the quiz!";
    buttonDiv.appendChild(startButton);
  
    // start game when start button clicked
    startButton.addEventListener("click",function() {
        // start clock
        startClock();
        // display questions
        displayQuestions(questionsAnswers);
        // remove button
        startButton.remove();
    });

    // if user wants to see high scores, display that page
    var highscoreLink = document.getElementById("highscore_link");
    highscoreLink.addEventListener("click",displayScores);
}

// start game clock
function startClock() {
    // set timer using global variable x, so I can access from gameOver()
    gameTimer = setInterval(function() {
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

// display questions, accepts questionsAnswers array so that different question/answer banks can be used
function displayQuestions(questionsAnswers) {
    // dump current question into var for readability/my sanity
    var currentQ = questionsAnswers[qNumber];
    var list = document.createElement("ul");

    // reset content box, then build list of answers
    contentHeader.innerHTML = currentQ.question;
    content.innerHTML = '';

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

        // if list item is clicked, check answer and display message correct vs. wrong at bottom
        document.getElementById("list#"+i).addEventListener("click",function() {
            if (this.getAttribute("data-correct") === "true") {
                // display right/wrong message in hidden div, make visible
                answerResult.setAttribute("style","display:all");
                answerResult.innerHTML = "Correct!";
            }
            else {
                // subtract 10 seconds
                gameClock -= 10;
                // display right/wrong message in hidden div, make visible
                answerResult.setAttribute("style","display:all");
                answerResult.innerHTML = "Incorrect!";
            }

            // end game if on the last question
            if (qNumber < (questionsAnswers.length - 1)) { 
                qNumber++;
                return displayQuestions(questionsAnswers);
            }
            else {
                gameOver();
            }
        });
    }
}

// handle end of game page/highscore input
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
        answerResult.remove();
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

// add username and score to localstorage
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

// display high scores
function displayScores() {
    contentHeader.innerHTML = "Here are the high scores: ";
    content.innerHTML = ""; // reset innerHTML
    buttonDiv.innerHTML = "";

    // default message if no scores in localstorage
    if (!localStorage.getItem("codeQuizScores")) {
        content.innerHTML = "No scores yet! Play the game!";
    }
    // otherwise, pull scores from localstorage and display them in list
    else {
        // use same variable name as in addScore for readability
        var oldScoreArray = JSON.parse(localStorage.getItem("codeQuizScores"));

        // sort scores from highest to lowest
        oldScoreArray.sort(function(a,b) {
            return b.score - a.score;
        });

        // get all of the old scores, display in list
        var scoreList = document.createElement("ul");
        for (i = 0; i < oldScoreArray.length; i++) {
            var scoreItem = document.createElement("li");
            scoreItem.innerHTML = (i+1) + ". " + oldScoreArray[i].name + " - " + oldScoreArray[i].score;
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