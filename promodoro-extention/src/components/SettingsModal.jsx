import React, { useState } from "react";

const SettingsModal = ({ tabsData, onSave, onClose }) => {
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
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};


export default SettingsModal;
