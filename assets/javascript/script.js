'use strict';
//Selectors
const icons = ['angular', 'css', 'javascript', 'react'];
const buttons = Array.from(document.querySelectorAll('.btns-wrapper .btn'));
const allRows = Array.from(document.querySelectorAll('.playing-rows .d-flex'));
const allCells = Array.from(document.querySelectorAll('.mb-2 .cell'));

const displayComb = Array.from(
  document.querySelectorAll('.mb-2 .question-mark')
);

//modal
const btnCloseModal = document.querySelector('.button-x');
const modal = document.querySelector('.modal');
const scoreValue = document.querySelector('.score-value');
const winImage = document.getElementById('win');
const loseImage = document.getElementById('lose');
const closeModal = btnCloseModal.addEventListener('click', closing);
const btnRestart = document.querySelector('.btn-restart');

//color row variables
const allColorCells = Array.from(
  document.querySelectorAll('.guess-rows .color-cell')
);
const allColorRows = Array.from(document.querySelectorAll('.guess-rows .row'));
const numberOfCellsInRow = 4;
let activeColorRowIndex = 0;
let activeColorRow = allColorRows[activeColorRowIndex];

//guess row variables
let userCombination = [];
let activeRowIndex = 0;
let activeRow = allRows[activeRowIndex];
let activeCellIndex = 0;
let correctCells = 0;

const generateCombination = function () {
  const aiCombination = [];
  for (let i = 0; i < icons.length; i++) {
    let randomIndex = Math.floor(Math.random() * icons.length);
    let randomElement = icons[randomIndex];
    aiCombination.push(randomElement);
  }
  console.log(aiCombination);
  return aiCombination;
};

let aiCombination = generateCombination();
function showAnswer() {
  for (let i = 0; i < displayComb.length; i++) {
    displayComb[i].classList.remove('question-mark');
    displayComb[i].classList.add('background-' + aiCombination[i]);
  }
}

function addButtons() {
  buttons.forEach((btn) => {
    btn.addEventListener('click', selectTechnology);
  });
}
addButtons();

function selectTechnology(e) {
  if (activeCellIndex < 4) {
    let activeCell = activeRow.children[activeCellIndex].classList;
    if (activeCell.length === 1) {
      activeCell.add(`background-${e.target.id}`);
      activeCell.add(e.target.id);
      activeCellIndex++;
    }

    if (activeCellIndex % numberOfCellsInRow === 0) {
      guessCombination();
      activeRowIndex++;
      matching();
      activeRow = allRows[activeRowIndex];
      activeCellIndex = 0;
    }
  }
}

document.addEventListener('keydown', keyPressed);

//deleting last added cell
function keyPressed(e) {
  if (e.code === 'Backspace') {
    let activeCell = activeRow.children[activeCellIndex - 1].classList;
    activeCell.remove(`${activeCell[2]}`);
    activeCell.remove(`${activeCell[1]}`);

    console.log(activeCell);

    activeCellIndex--;
  }
}

function guessCombination() {
  let activeCells = Array.from(activeRow.children);
  activeCells.forEach((element) => {
    if (element.classList.length === 3) {
      userCombination.push(element.classList[2]);
    }
  });

  return userCombination;
}

function matching() {
  console.log('user comb: ' + userCombination);
  let matched = [];
  let pointerAiCombination = [...aiCombination];

  for (let i = 0; i < pointerAiCombination.length; i++) {
    if (pointerAiCombination[i] === userCombination[i]) {
      pointerAiCombination[i] = '';
      userCombination[i] = '+';
      matched.push('green');
      correctCells++;
    }
  }

  for (let i = 0; i < userCombination.length; i++) {
    if (pointerAiCombination.includes(userCombination[i])) {
      pointerAiCombination[pointerAiCombination.indexOf(userCombination[i])] =
        '';
      userCombination[i] = '+';
      matched.push('red');
    }
  }

  matched.forEach((element, i) => {
    let activeCell = activeColorRow.children[i].classList;
    if (activeCell.length !== 2) {
      activeCell.add(element);
      i++;
    }
  });
  isGameOver(matched);

  activeColorRowIndex++;
  activeColorRow = allColorRows[activeColorRowIndex];

  userCombination = [];

  correctCells = 0;
}

function correctCombination() {
  return numberOfCellsInRow === correctCells;
}

function allMovesAreMade() {
  return activeRowIndex === allRows.length;
}

function gameOver() {
  buttons.forEach((element) => {
    element.removeEventListener('click', selectTechnology);
  });
  modal.classList.remove('hidden');
  showAnswer();
  correctCells = 0;
  window.onscroll = function () {
    window.scrollTo(0, 0);
  };
}

function isGameOver(matched) {
  if (correctCombination(matched)) {
    gameOver();
    winImage.classList.remove('hidden');

    let score = (allRows.length - activeRowIndex + 1) * 100;
    scoreValue.innerHTML = 'SCORE: ' + score;
  } else if (allMovesAreMade()) {
    gameOver();
    loseImage.classList.remove('hidden');
    scoreValue.innerHTML = 'SCORE: 0';
  }
}

function restart() {
  //clear all inputed cells
  allCells.forEach((element) => {
    element.classList.remove(element.classList[2]);
    element.classList.remove(element.classList[1]);
  });

  allColorCells.forEach((element) => {
    element.classList.remove(element.classList[1]);
  });
  //setting start point for both columns
  activeColorRowIndex = 0;
  activeColorRow = allColorRows[activeColorRowIndex];

  activeRowIndex = 0;
  userCombination = [];
  activeRow = allRows[activeRowIndex];
  activeCellIndex = 0;

  //hiding solution
  for (let i = 0; i < displayComb.length; i++) {
    displayComb[i].classList.remove('background-' + aiCombination[i]);
    displayComb[i].classList.add('question-mark');
  }
  addButtons();
  aiCombination = generateCombination();

  closing();
}

btnRestart.addEventListener('click', restart);

function closing() {
  modal.classList.add('hidden');
  winImage.classList.add('hidden');
  loseImage.classList.add('hidden');
}
