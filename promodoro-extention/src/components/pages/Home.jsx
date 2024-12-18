import React, { useState } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";

const Home = ({ isDarkMode, handleSessionComplete }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Pomodoro", value: "pomodoro", duration: "25:00" },
    { label: "Short Break", value: "short-break", duration: "5:00" },
    { label: "Long Break", value: "long-break", duration: "15:00" },
  ]);

  const [activeTab, setActiveTab] = useState(tabsData[0]?.value);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  const handleSettingsSave = (newDurations) => {
    setTabsData((prev) =>
      prev.map((tab) => ({
        ...tab,
        duration: newDurations[tab.value] || tab.duration,
      }))
    );
    setIsSettingsOpen(false);
  };

  const currentTab = tabsData.find((tab) => tab.value === activeTab);

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-4/5 max-w-3xl p-8 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Settings Icon */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-2xl p-2"
          >
            <FaCog />
          </button>
        </div>

        {/* Render Tab Buttons */}
        <div className="flex space-x-6 mb-8 justify-center">
          {tabsData.map((tab) => (
            <TabButton
              key={tab.value}
              tab={tab}
              activeTab={activeTab}
              setActiveTab={(value) => setActiveTab(value)}
            />
          ))}
        </div>

        {/* Render Timer */}
        {currentTab && (
          <TimeCircle
            duration={currentTab.duration}
            isRunning={isRunning}
            resetSignal={resetSignal}
          />
        )}

        {/* Control Buttons */}
        <div className="mt-8">
          <ControlButtons
            isRunning={isRunning}
            handleStartPause={handleStartPause}
            handleRestart={handleRestart}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          tabsData={tabsData}
          onSave={handleSettingsSave}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

const SettingsModal = ({ tabsData, onSave, onClose, isDarkMode }) => {
  const [customDurations, setCustomDurations] = useState(
    tabsData.reduce((acc, tab) => {
      acc[tab.value] = tab.duration;
      return acc;
    }, {})
  );

  const handleChange = (value, tabValue) => {
    setCustomDurations((prev) => ({ ...prev, [tabValue]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className={`w-4/5 max-w-lg p-8 rounded-lg ${
          isDarkMode ? "bg-gray-900 text-sky-600" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Customize Durations</h2>
        {tabsData.map((tab) => (
          <div key={tab.value} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {tab.label} Duration (MM:SS)
            </label>
            <input
              type="text"
              value={customDurations[tab.value]}
              onChange={(e) => handleChange(e.target.value, tab.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(customDurations)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
