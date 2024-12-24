import React, { useState, useEffect, useLayoutEffect } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../SettingsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ handleSessionComplete, isDarkMode }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 },
    { label: "Short Break", value: "short-break", duration: 300 },
    { label: "Long Break", value: "long-break", duration: 900 },
  ]);

  const [cycleCount, setCycleCount] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleRestart = () => {
    setIsRunning(false);
    setTimeLeft(tabsData[activeTabIndex]?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  const handleNextSession = () => {
    setIsRunning(false);

    const nextIndex =
      activeTabIndex === 0
        ? cycleCount < 3
          ? 1
          : 2
        : activeTabIndex === 1
        ? 0
        : 1;

    setActiveTabIndex(nextIndex);
    setTimeLeft(tabsData[nextIndex]?.duration || 0);

    if (nextIndex === 2) {
      setCycleCount(0);
    }

    if (activeTabIndex === 1) {
      setCycleCount((prev) => prev + 1);
    }

    setResetSignal((prev) => !prev);
  };

  const handleComplete = () => {
    const tab = tabsData[activeTabIndex];
    const completionTime = new Date().toLocaleString();

    if (typeof handleSessionComplete === "function") {
      handleSessionComplete({
        tab: tab.value,
        completionTime,
        status: "Completed",
      });
    } else {
      console.error("handleSessionComplete is not defined or is not a function");
    }

    toast.success(`Session "${tab.label}" completed!`);
    handleNextSession();
  };

  useLayoutEffect(() => {
    document.body.style.overflow = isSettingsOpen ? "hidden" : "auto";
  }, [isSettingsOpen]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      const sound = new Audio("/audio.mp3");
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const formatSessionProgress = () => `${cycleCount + 1}/4`;

  return (
    <>
      <div
        className={`w-full max-w-full p-8 rounded-lg ${
          isDarkMode
            ? "bg-blue-950 text-white shadow-xl shadow-blue-900"
            : "bg-slate-200 text-black shadow-lg shadow-gray-400"
        } relative`}
      >
        <div className="flex justify-end">
          <button
            className="text-2xl p-2 rounded-full"
            onClick={() => setIsSettingsOpen(true)}
          >
            <FaCog />
          </button>
        </div>
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
        <TimeCircle
          duration={formatTime(timeLeft)}
          isRunning={isRunning}
          resetSignal={resetSignal}
        />
        <div className="mt-4 text-xl">
          <span>Session {formatSessionProgress()}</span>
        </div>
        <ControlButtons
          isRunning={isRunning}
          handleStartPause={handleStartPause}
          handleRestart={handleRestart}
          handleNextSession={handleNextSession}
        />
      </div>
      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SettingsModal
              tabsData={tabsData}
              onSave={(updatedTabs) => {
                setTabsData(updatedTabs);
                setIsSettingsOpen(false);
              }}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Home;
