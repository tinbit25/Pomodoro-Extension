import React, { useState, useEffect } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";

const Home = ({ handleSessionComplete }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 }, // 25 minutes
    { label: "Short Break", value: "short-break", duration: 300 }, // 5 minutes
    { label: "Long Break", value: "long-break", duration: 900 }, // 15 minutes
  ]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    setTimeLeft(tabsData[activeTabIndex]?.duration || 0); // Fixed here
    setResetSignal((prev) => !prev);
  };

  const handleNextSession = () => {
    setIsRunning(false);
    const nextIndex = (activeTabIndex + 1) % tabsData.length;
    setActiveTabIndex(nextIndex);
    setTimeLeft(tabsData[nextIndex]?.duration || 0); // Fixed here
    setResetSignal((prev) => !prev);
  };

  const handleComplete = () => {
    const completionTime = new Date().toLocaleString();
    handleSessionComplete({
      tab: tabsData[activeTabIndex].value,
      completionTime,
      status: "Completed",
    });

    if (activeTabIndex === tabsData.length - 1) {
      alert("Congratulations! You completed one full Pomodoro cycle.");
    } else {
      handleNextSession();
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      const sound = new Audio("/sounds/notification.mp3"); // Replace with your sound file path
      sound.play();
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTabChange = (value) => {
    const index = tabsData.findIndex((tab) => tab.value === value);
    setActiveTabIndex(index);
    setTimeLeft(tabsData[index]?.duration || 0); // Fixed here
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  const handleSaveSettings = (updatedTabs) => {
    setTabsData(updatedTabs);
    const updatedTab = updatedTabs[activeTabIndex];
    setTimeLeft(updatedTab?.duration || 0); // Fixed here
    setIsSettingsOpen(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-full p-8 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            className="text-2xl p-2 rounded-full"
            onClick={() => setIsSettingsOpen(true)}
          >
            <FaCog />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-8 justify-center">
          {tabsData.map((tab) => (
            <TabButton
              key={tab.value}
              tab={tab}
              activeTab={tabsData[activeTabIndex].value}
              setActiveTab={handleTabChange}
            />
          ))}
        </div>

        {/* Timer */}
        <TimeCircle
          duration={formatTime(timeLeft)}
          isRunning={isRunning}
          resetSignal={resetSignal}
        />

        {/* Controls */}
        <div className="flex space-x-4">
          <ControlButtons
            isRunning={isRunning}
            handleStartPause={handleStartPause}
            handleRestart={handleRestart}
          />
          <button
            onClick={handleNextSession}
            className="px-4 py-2 rounded-full text-white font-bold bg-blue-500 hover:bg-blue-600"
          >
            Next Session
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          tabsData={tabsData}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

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

export default Home;
