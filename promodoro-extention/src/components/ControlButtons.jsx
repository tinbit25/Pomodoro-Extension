import React from "react";

const ControlButtons = ({ isRunning, handleStartPause, handleRestart }) => (
  <div className="flex space-x-4">
    <button
      onClick={handleStartPause}
      className={`px-4 py-2 rounded text-white font-bold ${isRunning ? "bg-yellow-500" : "bg-green-500"}`}
    >
      {isRunning ? "Pause" : "Start"}
    </button>
    <button
      onClick={handleRestart}
      className="px-4 py-2 rounded text-white font-bold bg-red-500"
    >
      Restart
    </button>
  </div>
);
export default ControlButtons;