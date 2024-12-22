// background.js

// This will be the background script for the Pomodoro Timer extension.
// It listens for events or messages from other parts of the extension and can manage long-running tasks like the timer.

let timerInterval = null;
let isTimerRunning = false;
let minutes = 25;  // Default Pomodoro timer set to 25 minutes.
let seconds = 0;   // Starting seconds.

function startTimer() {
  if (isTimerRunning) return;

  isTimerRunning = true;

  // Every second, decrease the time
  timerInterval = setInterval(() => {
    if (seconds === 0 && minutes === 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      // Show a notification when the timer finishes
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.jpg',
        title: 'Pomodoro Timer',
        message: 'Time is up! Take a break!',
      });
    } else {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  minutes = 25;
  seconds = 0;
}

// Respond to messages from the popup (index.html) or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startTimer();
    sendResponse({ status: 'started' });
  } else if (request.action === 'stop') {
    stopTimer();
    sendResponse({ status: 'stopped' });
  } else if (request.action === 'reset') {
    resetTimer();
    sendResponse({ status: 'reset' });
  }
});
