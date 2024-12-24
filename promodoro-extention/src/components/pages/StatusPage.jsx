import React, { useEffect, useState } from "react";

const StatusPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sessions/history", {
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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Session History</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="mb-4 border-b pb-4">
            <div>
              <strong>{session.tab}</strong>
            </div>
            <div>Focus Time: {Math.round(session.focusTime / 60)} minutes</div>
            <div>Short Break: {Math.round(session.shortBreak / 60)} minutes</div>
            <div>Long Break: {Math.round(session.longBreak / 60)} minutes</div>
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
    </div>
  );
};

export default StatusPage;
