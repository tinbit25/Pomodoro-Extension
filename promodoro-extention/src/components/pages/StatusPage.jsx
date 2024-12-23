import React, { useEffect, useState } from "react";

const StatusPage = () => {
  const [durations, setDurations] = useState(null);

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await fetch("/api/durations");
        const data = await response.json();
        setDurations(data);
      } catch (error) {
        console.error("Error fetching durations:", error);
      }
    };

    fetchDurations();
  }, []);

  if (!durations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Session Durations</h2>
      <ul>
        <li>Focus Time: {durations.focusTime} seconds</li>
        <li>Short Break: {durations.shortBreak} seconds</li>
        <li>Long Break: {durations.longBreak} seconds</li>
      </ul>
    </div>
  );
};

export default StatusPage;
