import React from "react";

const States = ({ sessionData }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Session History</h2>
      <ul className="space-y-4">
        {sessionData.map((session, index) => (
          <li
            key={index}
            className={`p-4 border rounded shadow-lg ${
              session.status === "Done Successfully"
                ? "bg-green-100 dark:bg-green-800"
                : "bg-red-100 dark:bg-red-800"
            }`}
          >
            <p><strong>Session:</strong> {session.tab}</p>
            <p><strong>Completion Time:</strong> {session.completionTime}</p>
            <p><strong>Status:</strong> {session.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default States;
