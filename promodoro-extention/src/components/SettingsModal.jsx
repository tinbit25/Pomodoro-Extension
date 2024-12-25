import React, { useState } from "react";

const SettingsModal = ({ tabsData, onSave, onClose, isDarkMode }) => {
  const [updatedTabs, setUpdatedTabs] = useState([...tabsData]);

  const handleChange = (index, field, value) => {
    const newTabs = [...updatedTabs];
    newTabs[index][field] = field === "duration" ? parseInt(value) || 0 : value;
    setUpdatedTabs(newTabs);
  };

  const handleSave = () => {
    onSave(updatedTabs);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode
            ? "bg-blue-900 text-white shadow-xl shadow-blue-900"
            : "bg-slate-200 text-black shadow-lg shadow-gray-400"
        } w-68`}
      >
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
              className={`w-full mt-1 p-2 border rounded-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
              }`}
            />
          </div>
        ))}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-full ${
              isDarkMode
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-gray-400 text-black hover:bg-gray-500"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-full ${
              isDarkMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
