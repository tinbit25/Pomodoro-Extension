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

  const handleStartPause = () => setIsRunning((prev) => !prev);
  const handleRestart = () => {
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  const handleComplete = () => {
    const completionTime = new Date().toLocaleString();
    handleSessionComplete({
      tab: activeTab,
      completionTime,
    });
    setIsRunning(false);
    setResetSignal((prev) => !prev);
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
            handleComplete={handleComplete}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};


export default Home;
