import React from "react";

const ControlButtons = ({ isRunning, handleStartPause, handleRestart, isDarkMode }) => (
  <div className="flex justify-center space-x-4 mt-8">
    <button
      onClick={handleStartPause}
      className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
        isRunning ? "bg-yellow-300 text-black" : "bg-yellow-700 text-white"
      } ${isDarkMode ? "dark:bg-yellow-700 dark:text-white" : ""}`}
    >
      {isRunning ? "Pause" : "Start"}
    </button>

    <button
      onClick={handleRestart}
      className={`px-8 py-2 rounded-full font-bold transition-all duration-300 ${
        isRunning ? "bg-red-500 text-white" : "bg-red-300 text-black"
      } ${isDarkMode ? "dark:bg-red-800 dark:text-white" : ""}`}
    >
      Restart
    </button>
  </div>
);

export default ControlButtons;
