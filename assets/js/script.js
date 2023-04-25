var question = document.querySelector('.question')
var score = document.querySelector('.score')

var timerElement = document.querySelector('.timer-count')
var startButton = document.querySelector('#start-button')
var options = $('#options')
var feedback = document.querySelector('#feedback')

var scoreCounter = 0
var isWin = false
var timer
var timerCount
var points = 0
var questionIndex = 0

//stores q&a
var questions = [
  'What programming language is one of the core technologies of the World Wide Web, alongside HTML and CSS?',
  'How do you add comments to JavaScript code?',
  'What are the looping structures in JavaScript?'
]
var answers = ['JavaScript', '//', 'All of these']
var choices = [
  ['JavaScript', 'Hot Mail', 'AOL', 'Facebook'],
  ['!!', '??', '//', '##'],
  ['For', 'While', 'Do-While', 'All of these']
]

// The init function is called when the page loads
function init () {
  getWins()
}

// The startGame function is called when the start button is clicked
function startGame () {
  isWin = false
  timerCount = 90
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true
  /*renderBlanks()*/
  startQuiz()
  startTimer()
}

function winGame () {
  scoreCounter++
  startButton.disabled = false
  setWins()
}

// The setTimer function starts and stops the timer and triggers winGame()
function startTimer () {
  // Sets timer
  timer = setInterval(function () {
    timerCount--
    timerElement.textContent = timerCount
    if (timerCount >= 0) {
      // Tests if win condition is met
      if (isWin && timerCount > 0) {
        // Clears interval and stops timer
        clearInterval(timer)
        winGame()
      }
    }
    // Tests if time has run out
    if (timerCount === 0) {
      // Clears interval
      clearInterval(timer)
      //TODO when time runs out, page with high score and initials
    }
  }, 1000)
}

var optionButtons
//starts quiz

function displayQuestion (questionIndex) {
  //var questionIndex = 0 // the index we use to map the list of questions to the list of choices and answers
  var chosenQuestion = questions[questionIndex]
  question.textContent = chosenQuestion

  for (var j = 0; j < choices[questionIndex].length; j++) {
    options.append(
      '<li><button class="option">' +
        choices[questionIndex][j] +
        '</button></li>'
    )
  }
  optionButtons = document.querySelectorAll('.option')

  // add event listener to each button
  for (var k = 0; k < optionButtons.length; k++) {
    optionButtons[k].addEventListener('click', e => {
      checkAnswer(e.target.innerText, questionIndex)
    })
  }
  console.log(optionButtons)
}

function startQuiz () {
  startButton.style.display = 'none'
  var cards = document.getElementsByClassName('card')
  for (var i = 0; i < cards.length; i++) {
    console.log(cards[i])
    cards[i].style.display = 'block'
  }
  displayQuestion(questionIndex)
}

function checkAnswer (selectedAnswer, questionIndex) {
  console.log(questionIndex)
  console.log(selectedAnswer)

  if (answers[questionIndex] === selectedAnswer) {
    console.log('correct')
    // display correct on screen
    feedback.textContent = 'Correct!'
    // add one point
    points++
    score.textContent = points
  } else {
    console.log('wrong')
    // display wrong on screen
    feedback.textContent = 'Incorrect!'
    // substract 10s from time
    timerCount = timerCount - 10
  }
  // move onto next question
  questionIndex++
  displayQuestion(questionIndex)
}

// Updates win count on screen and sets win count to client storage
function setWins () {
  score.textContent = scoreCounter
  localStorage.setItem('scoreCount', scoreCounter)
}

// These functions are used by init
function getWins () {
  // Get stored value from client storage, if it exists
  var storedScore = localStorage.getItem('scoreCount')
  // If stored value doesn't exist, set counter to 0
  if (storedScore === null) {
    scoreCounter = 0
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    scoreCounter = storedScore
  }
  //Render win count to page
  score.textContent = scoreCounter
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener('click', startGame)

// Calls init() so that it fires when page opened
init()

// Bonus: Add reset button
var resetButton = document.querySelector('.reset-button')

function resetGame () {
  // clears score to zero
  scoreCounter = 0

  // shows score, stores in local
  setWins()
}
// Attaches event listener to button
resetButton.addEventListener('click', resetGame)
