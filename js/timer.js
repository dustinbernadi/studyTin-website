import { playAlarmSound, popupDisplay } from "./utils.js";
import { updateMinutesToServer } from "./minutesApi.js";
import { totalMinutesFromDB } from "./authUi.js";

let timeLeft = 5;
let isRunning = false;
let timer;

let startTimeStamp = null;
let endTimeStamp = null;

export let state = "work";

let sessionMinutes = 0;
let elapsedSeconds = 0;

//fungsi untuk memperbarui tampilan waktu
export function updateDisplay() {
  let remaining;
  if (isRunning && endTimeStamp) {
    const now = Date.now();
    remaining = Math.max(0, Math.ceil((endTimeStamp - now) / 1000));
  } else {
    remaining = timeLeft;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const display = document.getElementById("timerDisplay");
  display.textContent = `${String(minutes).padStart(2, "0")}.${String(seconds).padStart(2, "0")}`;
}


//fungsi untuk start timer
export function startTimer() {
  if (isRunning === false) {
    isRunning = true;

    startTimeStamp = Date.now();
    endTimeStamp = startTimeStamp + timeLeft * 1000;

    timer = setInterval(() => {
      const now = Date.now();
      timeLeft = Math.max(0, Math.ceil((endTimeStamp - now) / 1000));


      getMinutesSession();

      // update display
      updateDisplay();

      updateTotalMinutesDisplay();
      if (timeLeft <= 0) {
        handleTimeout();
      }
    }, 1000);
  } else {
    return;
  }
}

function updateTotalMinutesDisplay() {
  const totalDisplay = document.getElementById("profileTotalMinutes");
  if (!totalDisplay) return;

  const total = totalMinutesFromDB + sessionMinutes;
  totalDisplay.textContent = total;
}

let minutesUploaded = 0;
let uploadStarted = false;

let uploadIntervalId = null;

export function totalMinutesSend() {
  if (uploadStarted) return;
  uploadStarted = true;

  uploadIntervalId = setInterval(async () => {
    const notYetUploaded = sessionMinutes - minutesUploaded;

    if (notYetUploaded > 0) {
      try {
        await updateMinutesToServer(notYetUploaded);
        minutesUploaded += notYetUploaded;
      } catch (error) {
        console.error("Error updating minutes to server:", error);
      }
    }
  }, 5 * 60 * 1000);
}

export function getMinutesSession() {
  if (state !== "work" && state !== "longWork") return;

  const now = Date.now();
  const durationInSeconds = Math.floor((now - startTimeStamp) / 1000);
  const newMinutes = Math.floor(durationInSeconds / 60);

  if (newMinutes > sessionMinutes) {
    sessionMinutes = newMinutes;
    document.getElementById("profileSessionMinutes").textContent = sessionMinutes;
  }
}

//fungsi untuk stop timer
export function stopTimer() {
  if (!isRunning) return;

  isRunning = false;
  clearInterval(timer);

  // Hitung ulang timeLeft berdasarkan waktu sekarang
  const now = Date.now();
  timeLeft = Math.max(0, Math.ceil((endTimeStamp - now) / 1000));
}

//fungsi untuk reset timer
export function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  uploadStarted = false;

  if (state == "longWork") {
    timeLeft = 3000;
  } else if (state == "work") {
    timeLeft = 1500;
  } else if (state == "break") {
    timeLeft = 300;
  } else if (state == "longBreak") {
    timeLeft = 900;
  }

  updateDisplay();
}

function switchMode(newState, newDuration) {
  // stop timer dulu
  clearInterval(timer);
  isRunning = false;

  // ubah state & waktu
  state = newState;
  timeLeft = newDuration;

  // reset timestamp supaya tidak bentrok
  startTimeStamp = null;
  endTimeStamp = null;

  // tampilkan waktu baru
  updateDisplay();
}


export function longWorkMode() {
 switchMode("longWork", 3000);
}

export function workMode() {
  switchMode("work", 1500);
}

export function breakMode() {
  switchMode("break", 300);
}

export function longBreakMode() {
  switchMode("longBreak", 900);
}

export function handleTimeout() {
  clearInterval(timer);
  popupDisplay();
  // alarmSound();
  playAlarmSound();

  if (state == "longWork") {
    timeLeft = 3000;
  } else if (state == "work") {
    timeLeft = 1500;
  } else if (state == "break") {
    timeLeft = 300;
  } else if (state == "longBreak") {
    timeLeft = 900;
  }

  updateDisplay();
  isRunning = false;
}
