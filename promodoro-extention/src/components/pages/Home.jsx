import React, { useState, useEffect, useLayoutEffect } from "react";
import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../SettingsModal";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Home = ({ handleSessionComplete }) => {
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

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Notify function for browser notifications
  const notify = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: message,
        icon: "/favicon.ico",
      });
    }
  };

  // Handle start/pause button
  const handleStartPause = () => setIsRunning((prev) => !prev);

  // Handle timer restart
  const handleRestart = () => {
    setIsRunning(false);
    setTimeLeft(tabsData[activeTabIndex]?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  // Handle next session (focus-time, short break, long break)
  const handleNextSession = () => {
    setIsRunning(false);

    const nextIndex =
      activeTabIndex === 0
        ? cycleCount < 3
          ? 1
          : 2 // Short Break for first 3 cycles, Long Break for last
        : activeTabIndex === 1
        ? 0
        : 1; // Reset to Focus-time after Short Break or Long Break

    setActiveTabIndex(nextIndex);
    setTimeLeft(tabsData[nextIndex]?.duration || 0);

    // Reset cycle count after Long Break
    if (nextIndex === 2) {
      setCycleCount(0);
    }

    // Update cycle count after Short Break
    if (activeTabIndex === 1) {
      setCycleCount((prev) => prev + 1);
    }

    setResetSignal((prev) => !prev);
  };

  // Handle session completion and send data to parent
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

    notify(`Session "${tab.label}" completed!`);

    // Special notification after completing Pomodoro or Long Break
    if (activeTabIndex === tabsData.length - 1 && cycleCount === 3) {
      toast.success("Congratulations! You completed one full Pomodoro cycle!");
      setCycleCount(0); // Reset cycle count for next round

      // Store data and refresh the page after cycle completion
      saveCycleData(true); // Store cycle completion data
      setTimeout(() => window.location.reload(), 2000); // Delay before page reload
    } else if (activeTabIndex === 2) {
      toast.info("Great! You've completed your long break!");
    } else {
      handleNextSession(); // Proceed to the next session
    }
  };

  // Store cycle completion data in the database (backend)
  const saveCycleData = async (completed) => {
    try {
      const response = await fetch("/api/storeCycleData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed, timestamp: new Date().toISOString() }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Cycle data stored successfully!");
      } else {
        toast.error("Failed to store cycle data.");
      }
    } catch (error) {
      console.error("Error saving cycle data:", error);
      toast.error("Error saving cycle data.");
    }
  };

  // Layout effect for preventing layout shifts when settings modal is open
  useLayoutEffect(() => {
    document.body.style.overflow = isSettingsOpen ? "hidden" : "auto";
  }, [isSettingsOpen]);

  // Timer logic: decrement time and trigger completion when time is up
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      const sound = new Audio("/audio.mp3"); // Make sure the path is correct
      sound.play();
      handleComplete(); // Trigger completion when time hits zero
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount or re-run
  }, [isRunning, timeLeft]);

  // Handle tab change
  const handleTabChange = (value) => {
    const index = tabsData.findIndex((tab) => tab.value === value);
    setActiveTabIndex(index);
    setTimeLeft(tabsData[index]?.duration || 0);
    setIsRunning(false);
    setResetSignal((prev) => !prev);
  };

  // Handle saving updated settings
  const handleSaveSettings = (updatedTabs) => {
    setTabsData(updatedTabs);
    const updatedTab = updatedTabs[activeTabIndex];
    setTimeLeft(updatedTab?.duration || 0);
    setIsSettingsOpen(false);
  };

  // Format time for display (e.g., 25:00)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Format session progress (e.g., 1/4, 2/4, etc.)
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

        {/* Session Progress */}
        <div className="mt-4 text-xl">
          <span>Session {formatSessionProgress()}</span>
        </div>

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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Home;
