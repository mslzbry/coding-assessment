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
  'What are the looping structures in JavaScript?',
  'An array in JavaScript is:'
]
var answers = ['JavaScript', '//', 'All of these', 'An ordered list of values']
var choices = [
  ['JavaScript', 'Hot Mail', 'AOL', 'Facebook'],
  ['!!', '??', '//', '##'],
  ['For', 'While', 'Do-While', 'All of these'],
  [
    'An ordered list of values',
    'An ordered list of objects',
    'An ordered list of strings',
    'An ordered list of functions'
  ]
]

// used to start the game
function startGame () {
  questionIndex = 0
  points = 0
  score.textContent = points
  gameDone = false
  timerCount = 90
  // disables start button when game in progress
  startButton.disabled = true
  startQuiz()
  startTimer()
}

function winGame () {
  startButton.disabled = false
}

// starts timer
function startTimer () {
  timer = setInterval(function () {
    timerCount--
    timerElement.textContent = timerCount
    if (timerCount >= 0) {
      if (gameDone && timerCount > 0) {
        clearInterval(timer)
        winGame()
      }
    }
    if (timerCount === 0) {
      clearInterval(timer)
      if (!gameDone) {
        gameOver()
      }
    }
  }, 1000)
}

var optionButtons
//starts quiz

function displayQuestion (questionIndex) {
  console.log('question index: ', questionIndex)
  if (questionIndex <= questions.length - 1) {
    //questionIndex is the index we use to map the list of questions to the list of choices and answers
    var chosenQuestion = questions[questionIndex]
    question.textContent = chosenQuestion

    // remove existing buttons from previous question
    if (questionIndex != 0) {
      options.empty()
    }

    for (var j = 0; j < choices[questionIndex].length; j++) {
      console.log('choice ', choices[questionIndex][j])
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
    console.log('game over in display question')
    gameOver()
  }
}

function gameOver () {
  console.log('GAME OVER')
  gameDone = true
  // removes the cards in the sections from the page
  $('.game').hide()
  // delete the buttons with the answers so they can get recreated again on new game
  options.empty()
  // remove the correct / incorrect feedback text
  feedback.textContent = ''

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

  var records = JSON.parse(localStorage.getItem('records') || '[]')
  var entry = {
    initials: initials,
    score: points,
    timeStamp: Date.now()
  }
  records.push(entry)
  localStorage.setItem('records', JSON.stringify(records))

  // remove the card with the form
  $('#initials-section').remove() //remove initial entry section
  showScores()
}

var ol
function showScores () {
  //displays all scores/records
  var section = $('<section id="highscores-section">')
  var divCard = $('<div class="card">')
  var h2 = $('<h2>')
  h2.text('High Scores:')
  divCard.css('display', 'block')
  divCard.append(h2)

  var records = JSON.parse(localStorage.getItem('records') || '[]')
  records = records.sort((a, b) => (a.score < b.score ? 1 : -1)) //sorts score by descending order
  ol = $('<ol>')
  for (var i = 0; i < records.length; i++) {
    ol.append(
      '<li>' + records[i]['initials'] + ' ' + records[i]['score'] + '</li>'
    )
  }
  ol.css('list-style', 'decimal')
  divCard.append(ol)
  divCard.append('<button class="replay-button">Replay</button>')
  divCard.append('<button class="reset-scores">Reset Scores</button>')
  section.append(divCard)
  main.append(section)

  var replayButton = document.querySelector('.replay-button')
  replayButton.addEventListener('click', replayGame)
  var resetScoresButton = document.querySelector('.reset-scores')
  resetScoresButton.addEventListener('click', resetScores)
}

function resetScores () {
  // clear local storage to erase all the high scores
  console.log('reset scores')
  localStorage.setItem('records', '[]')
  // need to refresh the html to show the blank high scores list now
  // do this by emptying the ol containing the scores
  ol.empty()
}

function replayGame () {
  console.log('replaying game')
  // clear the high scores card
  $('#highscores-section').remove()
  // then start game again but need to display the q/a cards again
  $('.game').show()
  startGame()
}

function enterInitials () {
  // create a section/new card for displaying the score and for entering initials
  var section = $('<section id="initials-section">')
  var divCard = $('<div class="card">')
  var h2 = $('<h2>')
  h2.text('All Done!')
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
    cards[i].style.display = 'block'
  }
  displayQuestion(questionIndex)
}

function checkAnswer (selectedAnswer, questionIndex) {
  console.log(questionIndex)
  console.log(selectedAnswer)
  console.log('points is: ', points)

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
    if (timerCount >= 10) {
      timerCount = timerCount - 10
    } else {
      gameOver()
    }
  }
  // move on to next question
  questionIndex++
  displayQuestion(questionIndex)
}

startButton.addEventListener('click', startGame)
