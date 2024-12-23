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
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    // Request notification permission on component mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const notify = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: message,
        icon: "/favicon.ico",
      });
    }
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    setTimeLeft(tabsData[activeTabIndex]?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  const handleNextSession = () => {
    setIsRunning(false);
    const nextIndex = (activeTabIndex + 1) % tabsData.length;
    setActiveTabIndex(nextIndex);
    setTimeLeft(tabsData[nextIndex]?.duration || 0);
    setResetSignal((prev) => !prev);

    // Update cycle count
    if (activeTabIndex === tabsData.length - 1) {
      setCycleCount((prev) => prev + 1);
    }
  };

  const handleComplete = () => {
    const tab = tabsData[activeTabIndex];
    const completionTime = new Date().toLocaleString();
    handleSessionComplete({
      tab: tab.value,
      completionTime,
      status: "Completed",
    });

    notify(`Session "${tab.label}" completed!`);

    if (activeTabIndex === tabsData.length - 1 && cycleCount === 3) {
      notify("Congratulations! You completed one full Pomodoro cycle!");
      alert("You completed a full Pomodoro cycle!");
      setCycleCount(0); // Reset cycle count for the next round
    } else {
      handleNextSession();
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      const sound = new Audio(`${process.env.PUBLIC_URL}/audio.mp3`);
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

export default Home;
