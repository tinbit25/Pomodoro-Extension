import React, { useState, useEffect } from "react";

const TimeCircle = ({ duration, isRunning, resetSignal }) => {
  const [timeLeft, setTimeLeft] = useState(() => safeParseDurationToSeconds(duration));

  useEffect(() => {
    setTimeLeft(safeParseDurationToSeconds(duration));
  }, [resetSignal, duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const circleSize = "250px"; // Slightly larger for a better look

  return (
    <div
      className={`flex justify-center items-center rounded-full shadow-xl mx-auto mt-8 transition-all duration-500 ease-in-out`}
      style={{
        width: circleSize,
        height: circleSize,
        border: "8px solid",
        borderColor: isRunning ? "#0284c7" : "rgba(200, 200, 200, 0.5)", // Dynamic border color
        background: isRunning
          ? "radial-gradient(circle, rgba(2, 132, 199, 0.4) 0%, rgba(59, 130, 246, 0.1) 70%)"
          : "radial-gradient(circle, rgba(209, 213, 219, 0.4) 0%, rgba(156, 163, 175, 0.1) 70%)", // Gradient background
        boxShadow: isRunning
          ? "0 4px 20px rgba(2, 132, 199, 0.3)"
          : "0 4px 20px rgba(156, 163, 175, 0.3)", // Dynamic shadow based on state
      }}
    >
      <span
        className="font-bold text-5xl text-gray-800"
        style={{
          color: isRunning ? "#1e40af" : "#334155", // Text color based on state
          transition: "color 0.3s ease-in-out",
        }}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

const safeParseDurationToSeconds = (duration) => {
  if (typeof duration === "number") {
    return duration; // Return the value directly if already in seconds
  }

  if (typeof duration === "string" && duration.includes(":")) {
    const [minutes, seconds] = duration.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
  }

  console.warn("Invalid duration format, falling back to default 0 seconds.");
  return 0; // Fallback value
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default TimeCircle;
