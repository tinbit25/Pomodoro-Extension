import React, { useEffect, useState } from "react";

const StatusPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

      if (!userId) {
        setError("User  ID is not available. Please log in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/sessions/history?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setSessions(data.sessions); // Ensure you're setting the correct property from the response
        } else {
          throw new Error(data.message || "Failed to fetch session history");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (sessions.length === 0) {
    return <div className="p-8">No session history available.</div>;
  }

  // Calculate total time spent
  const totalFocusTime = sessions.reduce((total, session) => total + session.focusTime, 0);
  const totalShortBreakTime = sessions.reduce((total, session) => total + session.shortBreak, 0);
  const totalLongBreakTime = sessions.reduce((total, session) => total + session.longBreak, 0);

  // Helper function to format time
  const formatTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return `${timeInSeconds} seconds`;
    } else {
      const minutes = Math.floor(timeInSeconds / 60);
      return `${minutes} minutes`;
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Session History</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="mb-4 border-b pb-4">
            <div>
              <strong>{session.tab}</strong>
            </div>
            <div>Focus Time: {formatTime(session.focusTime)}</div>
            <div>Short Break: {formatTime(session.shortBreak)}</div>
            <div>Long Break: {formatTime(session.longBreak)}</div>
            <div>Cycles: {session.cycleCount}</div>
            <small className="text-gray-500">
              Completed at:{" "}
              {session.completionTime
                ? new Date(session.completionTime).toLocaleString()
                : "N/A"}
            </small>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Total Time Spent</h3>
        <div>Focus Time: {formatTime(totalFocusTime)}</div>
        <div>Short Break: {formatTime(totalShortBreakTime)}</div>
        <div>Long Break: {formatTime(totalLongBreakTime)}</div>
      </div>
    </div>
  );
};

export default StatusPage;