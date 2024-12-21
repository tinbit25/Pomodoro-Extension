// popup.js (or wherever you want to send the message from)
document.getElementById('startButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start' }, (response) => {
      console.log('Timer started:', response.status);
    });
  });
  
  document.getElementById('stopButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
      console.log('Timer stopped:', response.status);
    });
  });
  
  document.getElementById('resetButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' }, (response) => {
      console.log('Timer reset:', response.status);
    });
  });
  