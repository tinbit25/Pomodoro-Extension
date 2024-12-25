import React, { useEffect, useState } from "react";

const StatusPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("userId");

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
          setSessions(data.sessions); 
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

  // Group sessions by purpose
  const groupedSessions = sessions.reduce((acc, session) => {
    const purpose = session.tab; 
    if (!acc[purpose]) {
      acc[purpose] = [];
    }
    acc[purpose].push(session);
    return acc;
  }, {});

  
  const lastSession = sessions[sessions.length - 1];

  
  const totalFocusTime = sessions.reduce((total, session) => total + session.focusTime, 0);
  const totalShortBreakTime = sessions.reduce((total, session) => total + session.shortBreak, 0);
  const totalLongBreakTime = sessions.reduce((total, session) => total + session.longBreak, 0);

 
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
      <h2 className="text-2xl font-bold mb-4">
        {lastSession && lastSession.tab === "long-break" && lastSession.cycleCount === 3
          ? "Pomodoro Cycle Completed!"
          : "Pomodoro Cycle Failed!"}
      </h2>
      <div className="mb-4">
        {lastSession && (
          <p>
            Last completed session: <strong>{lastSession.tab}</strong> at {new Date(lastSession.completionTime).toLocaleString()}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols -3 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Focus Time</h3>
          <p>{formatTime(totalFocusTime)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Short Break</h3>
          <p>{formatTime(totalShortBreakTime)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Long Break</h3>
          <p>{formatTime(totalLongBreakTime)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold">Session History</h3>
        {Object.keys(groupedSessions).map((purpose) => (
          <div key={purpose} className="mb-4">
            <h4 className="font-semibold">{purpose}</h4>
            <ul className="list-disc pl-5">
              {groupedSessions[purpose].map((session) => (
                <li key={session.id}>
                  <strong>{session.tab}</strong> - Completed at: {new Date(session.completionTime).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPage;