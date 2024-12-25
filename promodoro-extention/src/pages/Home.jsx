import React, { useState, useEffect, useLayoutEffect } from "react";
import TabButton from "../components/TabButton";
import TimeCircle from "../components/TimeCircle";
import ControlButtons from "../components/ControlButtons";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Home = ({ userId, isDarkMode }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 }, // 25 minutes
    { label: "Short Break", value: "short-break", duration: 300 }, // 5 minutes
    { label: "Long Break", value: "long-break", duration: 900 }, // 15 minutes
  ]);

  const [cycleCount, setCycleCount] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // New state variables for purpose and total time spent
  const [purpose, setPurpose] = useState(""); // Purpose of use
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [totalShortBreakTime, setTotalShortBreakTime] = useState(0);
  const [totalLongBreakTime, setTotalLongBreakTime] = useState(0);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Log userId to check if it's being passed correctly
  useEffect(() => {
    console.log("User  ID in Home component:", userId);
  }, [userId]);

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
        ? (cycleCount < 3 ? 1 : 2)
        : (activeTabIndex === 1 ? 0 : 1);

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

    // Update total time spent based on the active tab
    if (activeTabIndex === 0) {
      setTotalFocusTime((prev) => prev + tabsData[0].duration); // Add focus time
    } else if (activeTabIndex === 1) {
      setTotalShortBreakTime((prev) => prev + tabsData[1].duration); // Add short break time
    } else if (activeTabIndex === 2) {
      setTotalLongBreakTime((prev) => prev + tabsData[2].duration); // Add long break time
    }

    const sessionData = {
      userId: userId, 
      tab : purpose||"General", 
      focusTime: totalFocusTime + (activeTabIndex === 0 ? tabsData[0].duration : 0),
      shortBreak: totalShortBreakTime + (activeTabIndex === 1 ? tabsData[1].duration : 0),
      longBreak: totalLongBreakTime + (activeTabIndex === 2 ? tabsData[2].duration : 0),
      cycleCount: cycleCount + (activeTabIndex === 1 ? 1 : 0),
      completionTime: completionTime,
    };

    console.log("Session Data to be sent:", sessionData);
    saveSessionData(sessionData); // Save session data

    notify(`Session "${tab.label}" completed!`);

    // Refresh page after a complete Pomodoro cycle or long break
    if (activeTabIndex === tabsData.length - 1 && cycleCount === 3) {
      setCycleCount(0);
      toast.success("Pomodoro cycle completed! Resetting...");
      setTimeout(() => resetAppState(), 5000);
    } else if (activeTabIndex === 2) {
      toast.success("Pomodoro cycle completed! Resetting...");
      setTimeout(() => resetAppState(), 5000);
    } else {
      handleNextSession();
    }
    
    // Function to reset the application state
    function resetAppState() {
      setActiveTabIndex(0); // Reset to the first tab
      setCycleCount(0); // Reset cycle count
      
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving session data:", errorData);
        throw new Error("Failed to save session data");
      }

      const result = await response.json();
      console.log("Session data saved successfully:", result);
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
    <div className=" ">
      <div
        className={`w-full max-w-full px-8 pb-2 rounded-lg ${
          isDarkMode
            ? "bg-blue-950 text-white shadow-xl shadow-blue-900"
            : "bg-slate-200 text-black shadow-lg shadow-gray-400"
        } relative`}
      >
<div className="flex space-x-16">
<div className="mt-4 ">
          <input
            type="text"
            placeholder="Purpose of use (e.g., work, study)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={` ${isDarkMode
            ? "bg-blue-950 text-white shadow-xl"
            : "bg-slate-200 text-black shadow-lg"} border p-2 rounded mb-5`}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="text-2xl p-2 rounded-full"
            onClick={() => setIsSettingsOpen(true)}
          >
            <FaCog />
          </button>
        </div>
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
          resetSignal={resetSignal} />
        
        <div className="ml-10 font-mono mt-4 text-xl">
          <span>Completed Session {formatSessionProgress()}</span>
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