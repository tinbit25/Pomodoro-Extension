import React, { useState, useEffect } from "react";

const ControlButtons = ({
  isRunning,
  handleStartPause,
  handleRestart,
  focusTimeProgress,
  focusTimeTotal
}) => (
  <div className="flex space-x-4">
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

const SettingsModal = ({ tabsData, onSave, onClose }) => {
  const [updatedTabs, setUpdatedTabs] = useState([...tabsData]);

  const handleChange = (index, field, value) => {
    const newTabs = [...updatedTabs];
    newTabs[index][field] = field === "duration" ? parseInt(value) || 0 : value;
    setUpdatedTabs(newTabs);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        {updatedTabs.map((tab, index) => (
          <div key={tab.value} className="mb-4">
            <label className="block text-sm font-medium">
              {tab.label} Duration (seconds)
            </label>
            <input
              type="number"
              value={tab.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
              className="w-full mt-1 p-2 border rounded-full"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(updatedTabs)}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;
