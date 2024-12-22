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

  const circleSize = "200px"; // Adjusted size for a smaller, responsive circle

  return (
    <div
      className={`flex justify-center items-center rounded-full shadow-lg mx-auto mt-8 transition-all duration-300`}
      style={{
        width: circleSize,
        height: circleSize,
        border: "4px solid",
        borderColor: isRunning ? "#0284c7" : "#e2e8f0", // Dynamic color
        backgroundColor: isRunning ? "#bfdbfe" : "#f1f5f9", // Dynamic background
      }}
    >
      <span
        className="font-bold text-4xl"
        style={{
          color: isRunning ? "#1e40af" : "#334155", // Text color based on state
        }}
      >
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
