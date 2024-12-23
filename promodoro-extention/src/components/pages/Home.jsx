import React, { useState } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../SettingsModal";

const Home = ({ handleSessionComplete }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 }, // 25 minutes
    { label: "Short Break", value: "short-break", duration: 300 }, // 5 minutes
    { label: "Long Break", value: "long-break", duration: 900 }, // 15 minutes
  ]);

  const [activeTab, setActiveTab] = useState(tabsData[0]?.value);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    const activeTabData = tabsData.find((tab) => tab.value === activeTab);
    setTimeLeft(activeTabData?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  const handleComplete = () => {
    const completionTime = new Date().toLocaleString();
    handleSessionComplete({
      tab: activeTab,
      completionTime,
      status: "Completed",
    });
    handleRestart();
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    const selectedTab = tabsData.find((tab) => tab.value === value);
    setTimeLeft(selectedTab?.duration || 0);
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  const handleSaveSettings = (updatedTabs) => {
    setTabsData(updatedTabs);
    const updatedTab = updatedTabs.find((tab) => tab.value === activeTab);
    setTimeLeft(updatedTab?.duration || 0);
    setIsSettingsOpen(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl p-8 rounded-lg shadow-2xl bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex justify-end">
          <button
            className="text-3xl p-2 text-gray-700 hover:text-gray-900 transition-all duration-300"
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
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="relative">
          <TimeCircle
            duration={formatTime(timeLeft)}
            isRunning={isRunning}
            resetSignal={resetSignal}
          />
        </div>

        {/* Controls */}
        <ControlButtons
          isRunning={isRunning}
          handleStartPause={handleStartPause}
          handleRestart={handleRestart}
          handleComplete={handleComplete}
        />
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

export default Home;
