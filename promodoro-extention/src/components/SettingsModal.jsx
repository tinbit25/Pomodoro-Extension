import React, { useState } from "react";

const SettingsModal = ({ tabsData, onSave, onClose }) => {
  const [updatedTabs, setUpdatedTabs] = useState([...tabsData]);

  const handleChange = (index, field, value) => {
    const newTabs = [...updatedTabs];
    const parsedValue = parseInt(value) || 0;
    if (parsedValue <= 0) return;  // Prevent invalid duration (e.g., 0 or negative)
    newTabs[index][field] = parsedValue;
    setUpdatedTabs(newTabs);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="p-6 rounded-xl shadow-lg bg-white transform transition-all duration-300 scale-110 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Settings</h2>
        {updatedTabs.map((tab, index) => (
          <div key={tab.value} className="mb-6">
            <label className="block text-lg font-medium text-gray-600">
              {tab.label} Duration (seconds)
            </label>
            <input
              type="number"
              value={tab.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
              className="w-full mt-3 p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-6">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(updatedTabs)}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
