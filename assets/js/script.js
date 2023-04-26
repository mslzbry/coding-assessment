var question = document.querySelector('.question')
var score = document.querySelector('.score')

var timerElement = document.querySelector('.timer-count')
var startButton = document.querySelector('#start-button')
var options = $('#options')
var feedback = document.querySelector('#feedback')
var main = $('main')

var gameDone = false
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
  gameDone = false
  timerCount = 11
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true
  /*renderBlanks()*/
  startQuiz()
  startTimer()
}

function winGame () {
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
      if (gameDone && timerCount > 0) {
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
      gameOver()
    }
  }, 1000)
}

var optionButtons
//starts quiz

function displayQuestion (questionIndex) {
  if (questionIndex <= questions.length - 1) {
    //questionIndex is the index we use to map the list of questions to the list of choices and answers
    var chosenQuestion = questions[questionIndex]
    question.textContent = chosenQuestion

    // remove existing buttons from previous question
    if (questionIndex != 0) {
      options.empty()
    }

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
  } else {
    // call gameOver() to end the game
    gameOver()
  }
}

function gameOver () {
  console.log('GAME OVER')
  gameDone = true
  // removes the cards in the sections from the page
  $('section').remove()
  // change the html to have user add initials
  enterInitials()
  // on saving the user's initials, prev scores displayed in list via local storage
  // also have the ability to play again
}

function submitForm () {
  console.log('submit form')
  // once user typed in initials and submitted form,
  // save in local storage and also load the high scores page
  var initials = document.getElementById('initials').value
  console.log(initials)
  console.log(Date.now())
}

function enterInitials () {
  // create a section/new card for displaying the score and for entering initials
  var section = $('<section>')
  var divCard = $('<div class="card">')
  var h2 = $('<h2>')
  h2.text('All done!')
  divCard.css('display', 'block')
  divCard.append(h2)
  section.append(divCard)

  divCard.append(
    '<form onsubmit="return false;"><label>Initials:</label><br><input type="text" id="initials"><br></br><input type="submit" value="Submit" onclick="submitForm()"></form>'
  )
  var h3 = $('<h3>')
  h3.text('Score: ' + points)
  divCard.append(h3)

  main.append(section)
  console.log('points: ', points)
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
  // move on to next question
  questionIndex++
  displayQuestion(questionIndex)
}

// Updates win count on screen and sets win count to client storage
function setWins () {
  score.textContent = points
  //localStorage.setItem('points', points)
}

// These functions are used by init
function getWins () {
  // Get stored value from client storage, if it exists
  //var storedScore = localStorage.getItem('points')
  var storedScore = null
  // If stored value doesn't exist, set counter to 0
  if (storedScore === null) {
    points = 0
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    points = storedScore
  }
  //Render win count to page
  score.textContent = points
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener('click', startGame)

// Calls init() so that it fires when page opened
init()

// Bonus: Add reset button
var resetButton = document.querySelector('.reset-button')

function resetGame () {
  // clears score to zero
  points = 0

  // shows score, stores in local
  setWins()
}
// Attaches event listener to button
resetButton.addEventListener('click', resetGame)
