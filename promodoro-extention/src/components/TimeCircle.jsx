import React, { useState, useEffect } from "react";

const TimeCircle = ({ duration, isRunning, resetSignal, isDarkMode }) => {
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

  const circleSize = "250px"; 

  return (
    <div
      className={`flex justify-center items-center rounded-full shadow-xl mx-auto mt-8 transition-all duration-500 ease-in-out`}
      style={{
        width: circleSize,
        height: circleSize,
        border: "8px solid",
        borderColor: isRunning ? "#0284c7" : "rgba(200, 200, 200, 0.5)", 
        background: isRunning
          ? "radial-gradient(circle, rgba(2, 132, 199, 0.4) 0%, rgba(59, 130, 246, 0.1) 70%)"
          : "radial-gradient(circle, rgba(209, 213, 219, 0.4) 0%, rgba(156, 163, 175, 0.1) 70%)", 
        boxShadow: isRunning
          ? "0 4px 20px rgba(2, 132, 199, 0.3)"
          : "0 4px 20px rgba(156, 163, 175, 0.3)", 
      }}
    >
      <span
  className={`font-bold text-5xl transition-colors duration-300 ease-in-out ${
    isDarkMode
      ? "text-white"
      : isRunning
      ? "text-green-300" 
      : "text-green-300" // Replace "#334155" with equivalent Tailwind class
  }`}
>
  {formatTime(timeLeft)}
</span>

    </div>
  );
};

const safeParseDurationToSeconds = (duration) => {
  if (typeof duration === "number") {
    return duration; 
  }

  if (typeof duration === "string" && duration.includes(":")) {
    const [minutes, seconds] = duration.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
  }

  console.warn("Invalid duration format, falling back to default 0 seconds.");
  return 0; 
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default TimeCircle;
