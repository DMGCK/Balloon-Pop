
//#region Game Logic and Data



let startButton = document.getElementById('start-button')
let inflateButton = document.getElementById('inflate-button')
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let currentPopCount = 0
let highestPopCount = 0
let gameLength = 10000 //ms
let clockID = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = 'red'
let possibleColors = ['green', 'blue', 'purple', 'pink', 'red']
let players = []


function startGame() { // STARTS A TIMER and finished the game after time is at 0
  // startButton.setAttribute("disabled", "true")
  // inflateButton.removeAttribute("disabled")

  //document.getElementById("countdown").innerText = (gameLength / 1000).toString
  document.getElementById('game-controls').classList.remove('hidden')
  document.getElementById('main-controls').classList.add('hidden')
  document.getElementById('scoreboard').classList.add('hidden')
  

  startClock()
  console.log("time to start")
  setTimeout(stopGame, gameLength) //timer in ms, run function stopgame
  
}

function startClock() { // probably tell the variable what it's supposed to be first lol
  timeRemaining = gameLength
  drawClock()
  clockID = setInterval(drawClock, 1000)
}


function drawClock() {
  let countdownElem = document.getElementById('countdown')
  countdownElem.innerText = (timeRemaining/1000).toString()
  timeRemaining -= 1000
}

function stopClock() {
  clearInterval(clockID)
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i]
}

function inflate() { //updates the data, but does not draw a new frame without calling draw first
  clickCount++
  
  
  height += inflationRate
  width += inflationRate
  
  checkBalloonPop()

  draw()
}

function checkBalloonPop() {
  if (height >= maxSize) {
    let balloonElement = document.getElementById('balloon')
    currentPopCount++
    height = 60
    width = 50
    balloonElement.classList.remove(currentColor)
    getRandomColor()
    balloonElement.classList.add(currentColor)

    document.getElementById('pop-sound').play()
  }
}

function draw() { // actually changes elements in HTML
  let balloonElement = document.getElementById("balloon")
  let clickCountElem = document.getElementById('click-count')
  let popCountElem = document.getElementById('pop-count')
  let highCountElem = document.getElementById('high-score')
  let playerNameElem = document.getElementById('player-name')

  balloonElement.style.height =  height + "px"
  balloonElement.style.width = width + "px"
  clickCountElem.innerText = clickCount.toString() 
  popCountElem.innerText = currentPopCount.toString()
  highCountElem.innerText = currentPlayer.topScore.toString()
  playerNameElem.innerText = currentPlayer.name
  
}

function stopGame() {
  console.log("game is over")

  // inflateButton.setAttribute("disabled", "true")
  // startButton.removeAttribute("disabled")
  document.getElementById('game-controls').classList.add('hidden')
  document.getElementById('main-controls').classList.remove('hidden')
  document.getElementById('scoreboard').classList.remove('hidden')
  

  clickCount = 0
  height = 120
  width = 100
 
  
  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }
  currentPopCount = 0
  stopClock()
  drawScoreboard()
  draw() 
}


//#endregion Region Game Logic and Data

//#region Form, saving and Top Score logic


loadPlayers() // don't save the array before it's loaded, you will lose everything

// QOL, .toLowerCase() the names as the font doesn't display lowercase letters. Don't know how .toLowerCase() interacts with JSONifying the object
function setPlayer(event) { // needs an event from the HTML side
  event.preventDefault()
  let form = event.target // grabs stuff from the form
  console.log(form.playerName.value.toLowerCase()) // prints more specific stuff from the form
  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)

  if (!currentPlayer) { // if no current player, make object current player, then save.
    currentPlayer = {name: playerName, topScore: 0}
    players.push(currentPlayer)
    savePlayers()
  }

console.log(currentPlayer)

  form.reset()
  document.getElementById('game').classList.remove('hidden') //access and change css classes
  form.classList.add('hidden')
  draw()
  drawScoreboard()
}

function changePlayer() {
  document.getElementById('player-form').classList.remove('hidden')
  document.getElementById('game').classList.add("hidden")
}


//handling local storage
function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem('players'))
  if(playersData) { // is any nonzero value, then
    players = playersData
  }
}


function drawScoreboard () {
  let template = ''

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  players.forEach(player => { //MUST USE LAMBDA DESCRIPTOR NOT NAME OF ACTUAL ARRAY/OBJECT IN QUESTION
    template += 
    `<div class="d-flex space-between">
    <span>
      <i class="fa fa-user-circle" aria-hidden="true"></i>
      ${player.name} 
      </span>
    <span>Score: ${player.topScore}</span>
  </div>`
  });

  document.getElementById('players').innerHTML = template
}

drawScoreboard() //does this every time the page loads