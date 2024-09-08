"use strict";

let gMaxNum;
let gNums;
let gMsg;
let gNextNum;
let gTimer;
let gStartTime;
let gTimerRunning;

function initGame() {
  startGame();
}

function startGame() {
  gNums = createNums(gMaxNum);
  gMsg = "Welcome to Touch Numbers GAME, Good luck!";
  gNextNum = 1;
  gTimer = null;
  gStartTime = 0;
  gTimerRunning = false;
  renderGame();
}

function createNums(maxNum = 9) {
  let nums = [];
  for (let i = 1; i <= maxNum; i++) {
    nums.push(i);
  }
  return reorganizeNums(nums);
}

function reorganizeNums(arr) {
  let newArr = [];
  let cloneArr = [...arr];

  for (let i = 0; i < arr.length; i++) {
    const randomInx = Math.floor(Math.random() * cloneArr.length);
    newArr.push(cloneArr[randomInx]);
    cloneArr.splice(randomInx, 1);
  }
  return newArr;
}

function onCellClicked(elCell) {
  const num = +elCell.textContent;

  startTimer();

  if (num === gNextNum) {
    elCell.classList.add("correct");
    if (isWin()) return;
    gNextNum++;
    renderNextNum();

    return;
  }
}

function startTimer() {
  if (!gTimerRunning) {
    gStartTime = Date.now();
    gTimer = setInterval(renderTimer, 10);
    gTimerRunning = true;
  }
}

function resetTimer() {
  clearInterval(gTimer);
  gStartTime = 0;
  renderTimer();
}

function updateTimer() {
  if (!gStartTime) {
    return "00:00:00";
  }

  const currTime = Date.now();

  let time = currTime - gStartTime;

  let minutes = Math.floor((time / (1000 * 60)) % 60);
  let seconds = Math.floor((time / 1000) % 60);
  let milliSecondes = Math.floor((time % 1000) / 10);

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  milliSecondes = String(milliSecondes).padStart(2, "0");

  return `${minutes}:${seconds}:${milliSecondes}`;
}

function onLevel(elBtn) {
  const elLevel = elBtn.textContent;

  if (elLevel === "Easy") {
    gMaxNum = 9;
  } else if (elLevel === "Normal") {
    gMaxNum = 16;
  } else if (elLevel === "Hard") {
    gMaxNum = 25;
  } else if (elLevel === "Extreme") {
    gMaxNum = 36;
  }
  startGame();
}

function isWin() {
  if (gNextNum >= gNums.length / 2 && gNextNum < gNums.length - 2) {
    renderMsg("Great, keep going");
    return false;
  }
  if (gNextNum === gNums.length - 2) {
    renderMsg("Almost there...");
    return false;
  } else if (gNextNum === gNums.length) {
    renderMsg("You Won!");
    clearInterval(gTimer);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------
// RENDER FUNCTIONS

function renderGame() {
  renderMsg(gMsg);
  renderNextNum();
  renderBoard();
  renderTimer();
  renderBtns();
}

function renderMsg(msg) {
  const elMsg = document.querySelector(".msg");
  elMsg.innerText = msg;
}

function renderNextNum() {
  const elNextNum = document.querySelector(".next-num");
  elNextNum.innerText = `Next Number: ${gNextNum}`;
}

function renderBoard() {
  const elTable = document.querySelector("table");
  const length = Math.sqrt(gNums.length);
  let idx = 0;

  let table = "<tbody> ";

  for (let i = 0; i < length; i++) {
    table += "<tr>";
    for (let j = idx; j < length + idx; j++) {
      table += `<th onclick="onCellClicked(this)">${gNums[j]}</th>`;
    }
    idx += length;
    table += "</tr>";
  }
  table += "</tbody>";

  elTable.innerHTML = table;
}

function renderTimer() {
  const elTimer = document.querySelector(".timer");

  elTimer.innerText = updateTimer();
}

function renderBtns() {
  const elBtns = document.querySelector(".difficulty-btns");
  const btns = ["Easy", "Normal", "Hard", "Extreme"];

  let btnsStr = "";
  for (let i = 0; i < btns.length; i++) {
    btnsStr += `<button  onclick="onLevel(this)">${btns[i]}</button>`;
  }
  elBtns.innerHTML = btnsStr;
}
