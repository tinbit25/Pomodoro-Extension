import React, { useState, useEffect } from "react";

const ControlButtons = ({
  isRunning,
  handleStartPause,
  handleRestart,
  focusTimeProgress,
  focusTimeTotal
}) => (
  <div className="flex space-x-4 justify-between">
    <button
      onClick={handleStartPause}
      className={`px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform hover:scale-105 ${isRunning ? "bg-yellow-500 hover:bg-yellow-400" : "bg-green-500 hover:bg-green-400"}`}
    >
      {isRunning ? "Pause" : "Start"}
    </button>
    <button
      onClick={handleRestart}
      className="px-6 py-3 rounded-full text-white font-bold bg-red-500 hover:bg-red-400 transition-all duration-300 transform hover:scale-105"
    >
      Restart
    </button>
    
    {/* Focus Time Progress */}
    {focusTimeProgress < focusTimeTotal && (
      <div className="text-xl text-white font-bold mt-2">
        Focus Time: {focusTimeProgress} / {focusTimeTotal}
      </div>
    )}
  </div>
);


export default ControlButtons;
