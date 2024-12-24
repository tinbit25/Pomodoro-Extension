import React, { useState, useEffect, useLayoutEffect } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../SettingsModal";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Home = ({ userId }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 }, // 25 minutes
    { label: "Short Break", value: "short-break", duration: 300 }, // 5 minutes
    { label: "Long Break", value: "long-break", duration: 900 }, // 15 minutes
  ]);

  const [cycleCount, setCycleCount] = useState(0); // Tracks completed cycles
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Tracks the current tab (Focus, Break, Long Break)
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration); // Tracks time left in the current session
  const [isRunning, setIsRunning] = useState(false); // Tracks if the timer is running
  const [resetSignal, setResetSignal] = useState(false); // Used to force a reset on the timer
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Tracks whether settings modal is open

  useEffect(() => {
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
    const completionTime = new Date().toISOString();

    const sessionData = {
        userId: userId || "unknown",
        tab: tab.value || "unknown",
        completionTime: completionTime || new Date().toISOString(),
        cycleCount: cycleCount + (activeTabIndex === 1 ? 1 : 0),
        focusTime: tabsData[0]?.duration || 0,
        shortBreak: tabsData[1]?.duration || 0,
        longBreak: tabsData[2]?.duration || 0,
    };

    saveSessionData(sessionData); // Data saved without toast

    notify(`Session "${tab.label}" completed!`);

    // Refresh page after a complete Pomodoro cycle or long break
    if (activeTabIndex === tabsData.length - 1 && cycleCount === 3) {
      setCycleCount(0);
      toast.success("Pomodoro cycle completed! Refreshing...");
      setTimeout(() => window.location.reload(), 5000); // Refresh after 2 seconds
    } else if (activeTabIndex === 2) {
      toast.success("Pomodoro cycle completed! Refreshing...");
      setTimeout(() => window.location.reload(), 5000); // Refresh after long break
    } else {
      handleNextSession();
    }
  };

  const saveSessionData = async (sessionData) => {
    try {
      const response = await fetch("http://localhost:5000/api/sessions/saveSessionData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });
      const result = await response.json();
      // No toast notifications here for success/failure
    } catch (error) {
      console.error("Error saving session data:", error);
    }
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

  const formatSessionProgress = () => {
    return `${cycleCount + 1}/4`;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-full p-8 rounded-lg shadow-lg relative">
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
              onSave={handleSaveSettings}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Home;
