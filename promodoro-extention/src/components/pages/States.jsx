import React from "react";

const States = ({ sessionData }) => {
  return (
    <div className="m-4 min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex justify-center items-center">
      <div className="w-full md:w-3/4 bg-gray-50 dark:bg-gray-800 rounded p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Session History</h2>

        {sessionData.length > 0 ? (
          sessionData.map((session) => (
            <div
              key={session.sessionNumber}
              className="p-4 bg-white dark:bg-gray-700 my-2 rounded shadow"
            >
              <p><strong>Session ID:</strong> {session.sessionNumber}</p>
              <p><strong>Type:</strong> {session.type}</p>
              <p><strong>Duration:</strong> {session.duration}</p>
              <p><strong>Completed At:</strong> {new Date(session.completedAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No completed sessions found.</p>
        )}
      </div>
    </div>
  );
};

export default States;
