import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import TabButton from "../TabButton";
import TimeCircle from "../TimeCircle";
import ControlButtons from "../ControlButtons";
import { FaCog } from "react-icons/fa";
const Home = ({ handleSessionComplete, user }) => {
  const [tabsData, setTabsData] = useState([
    { label: "Focus-time", value: "focus-time", duration: 1500 },
    { label: "Short Break", value: "short-break", duration: 300 },
    { label: "Long Break", value: "long-break", duration: 900 },
  ]);

  const [activeTab, setActiveTab] = useState(tabsData[0]?.value);
  const [timeLeft, setTimeLeft] = useState(tabsData[0]?.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [focusHours, setFocusHours] = useState(0); // Track total focus hours
  const [completedSessions, setCompletedSessions] = useState(0); // Track completed sessions

  useEffect(() => {
    if (user) {
      // Load user data on initial load
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFocusHours(userData.focusHours || 0);
          setCompletedSessions(userData.completedSessions || 0);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleComplete = async () => {
    const completionTime = new Date().toLocaleString();
    const newFocusHours = focusHours + tabsData.find((tab) => tab.value === activeTab).duration / 3600;
    const newCompletedSessions = completedSessions + 1;

    // Update Firestore with new stats
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        focusHours: newFocusHours,
        completedSessions: newCompletedSessions,
      });
    }

    setFocusHours(newFocusHours);
    setCompletedSessions(newCompletedSessions);
    handleSessionComplete({
      tab: activeTab,
      completionTime,
      status: "Completed",
    });
    handleRestart();
  };

  const handleRestart = () => {
    setIsRunning(false);
    const activeTabData = tabsData.find((tab) => tab.value === activeTab);
    setTimeLeft(activeTabData?.duration || 0);
    setResetSignal((prev) => !prev);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-4/5 max-w-3xl p-8 rounded-lg shadow-lg">
        {/* Display User Stats */}
        <div className="text-center mb-6">
          <h2>Total Focus Hours: {focusHours.toFixed(2)} hours</h2>
          <h2>Completed Sessions: {completedSessions}</h2>
        </div>

        {/* Existing Code */}
        <div className="flex justify-end">
          <button className="text-2xl p-2" onClick={() => setIsSettingsOpen(true)}>
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
        <TimeCircle duration={formatTime(timeLeft)} isRunning={isRunning} resetSignal={resetSignal} />

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
