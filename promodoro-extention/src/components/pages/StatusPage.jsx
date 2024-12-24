import React, { useEffect, useState } from "react";

const StatusPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add your authorization token if needed
            // "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.statusText}`);
        }

        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Session History</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="mb-4">
            <div>
              <strong>{session.tab}</strong> - {session.status}
            </div>
            <div>Focus Time: {session.focusTime} minutes</div>
            <div>Short Break: {session.shortBreak} minutes</div>
            <div>Long Break: {session.longBreak} minutes</div>
            <div>Cycles: {session.cycleCount}</div>
            <small className="text-gray-500">
              Completed at: {new Date(session.completionTime).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusPage;
