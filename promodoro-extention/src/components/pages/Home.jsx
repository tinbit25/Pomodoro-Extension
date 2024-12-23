import React, { useState, useEffect } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";

const Home = ({ handleSessionComplete }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1 }, // 25 minutes
    { label: "Short Break", value: "short-break", duration: 300 }, // 5 minutes
    { label: "Long Break", value: "long-break", duration: 900 }, // 15 minutes
  ]);

  const [cycleCount, setCycleCount] = useState(0); // Tracks cycles completed
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    setTimeLeft(tabsData[activeTabIndex]?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  const handleNextSession = () => {
    setIsRunning(false);

    if (activeTabIndex === 0) {
      const nextIndex = cycleCount < 3 ? 1 : 2; // Short Break for first 3 cycles, Long Break for the last
      setActiveTabIndex(nextIndex);
      setTimeLeft(tabsData[nextIndex]?.duration || 0);

      if (nextIndex === 2) {
        setCycleCount(0); // Reset cycles after Long Break
      }
    } else {
      setActiveTabIndex(0); // Return to Focus-time
      setTimeLeft(tabsData[0]?.duration || 0);

      if (activeTabIndex === 1) {
        setCycleCount((prev) => prev + 1); // Increment cycles after Short Break
      }
    }

    setResetSignal((prev) => !prev);
  };

  const handleComplete = () => {
    const completionTime = new Date().toLocaleString();
    handleSessionComplete({
      tab: tabsData[activeTabIndex].value,
      completionTime,
      status: "Completed",
    });

    const sound = new Audio("/sounds/notification.mp3"); // Replace with your sound file path
    sound.play();
    handleNextSession();
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
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
    setTimeLeft(tabsData[index]?.duration || 0);
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  const handleSaveSettings = (updatedTabs) => {
    setTabsData(updatedTabs);
    const updatedTab = updatedTabs[activeTabIndex];
    setTimeLeft(updatedTab?.duration || 0);
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
        <ControlButtons
          isRunning={isRunning}
          handleStartPause={handleStartPause}
          handleRestart={handleRestart}
          handleNextSession={handleNextSession}
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
