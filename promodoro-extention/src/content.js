// document.addEventListener("DOMContentLoaded", () => {
//     const startButton = document.getElementById("startButton");
//     const stopButton = document.getElementById("stopButton");
//     const resetButton = document.getElementById("resetButton");
  
//     // Check if the buttons exist before adding event listeners
//     if (startButton && stopButton && resetButton) {
//       startButton.addEventListener("click", () => {
//         chrome.runtime.sendMessage({ action: "start" }, (e) => {
//           console.log("Timer started:", e.status);
//         });
//       });
  
//       stopButton.addEventListener("click", () => {
//         chrome.runtime.sendMessage({ action: "stop" }, (e) => {
//           console.log("Timer stopped:", e.status);
//         });
//       });
  
//       resetButton.addEventListener("click", () => {
//         chrome.runtime.sendMessage({ action: "reset" }, (e) => {
//           console.log("Timer reset:", e.status);
//         });
//       });
//     }
//   });
  