// TimeCircle.js
import React, { useState, useEffect } from "react";

const TimeCircle = ({ duration, isRunning, resetSignal }) => {
  const [timeLeft, setTimeLeft] = useState(parseDurationToSeconds(duration));

  useEffect(() => {
    setTimeLeft(parseDurationToSeconds(duration));
  }, [resetSignal, duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div
      className={`w-64 h-64 
                  bg-transparent 
                  rounded-full 
                  border-4 border-white 
                  flex justify-center items-center shadow-lg 
                  mx-auto mt-8 
                  ${isRunning ? "bg-sky-800 text-black" : "bg-sky-100 text-black"}
                  transition-all duration-300
                  dark:bg-sky-800 dark:text-white`}
    >
      <span className="font-bold text-6xl">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

const parseDurationToSeconds = (duration) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default TimeCircle;
