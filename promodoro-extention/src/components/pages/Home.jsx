// src/components/Home.js
import React, { useState, useEffect } from "react";
import ControlButtons from "../ControlButtons";
import TimeCircle from "../TimeCircle";

const Home = ({ setSessionData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [resetSignal, setResetSignal] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          logSession("Done Successfully");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500);
    setResetSignal((prev) => !prev);
    logSession("Reset");
  };

  const logSession = (status) => {
    setSessionData((prev) => [
      ...prev,
      {
        tab: "Pomodoro Session",
        completionTime: new Date().toLocaleTimeString(),
        status,
      },
    ]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <TimeCircle duration={formatTime(timeLeft)} isRunning={isRunning} resetSignal={resetSignal} />
      <ControlButtons
        isRunning={isRunning}
        handleStartPause={toggleTimer}
        handleRestart={resetTimer}
      />
    </div>
  );
};

export default Home;