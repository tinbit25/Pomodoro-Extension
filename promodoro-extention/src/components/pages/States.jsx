import React from "react";
import PropTypes from "prop-types";

const States = ({ sessionData }) => {
  if (!sessionData || sessionData.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Session History</h2>
        <p className="text-gray-500">No session data available.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Session History</h2>
      <ul className="space-y-4">
        {sessionData.map((session, index) => (
          <li
            key={index}
            className={`p-4 border rounded shadow-lg transition-transform duration-300 hover:scale-105 ${
              session.status === "Done Successfully"
                ? "bg-green-100 dark:bg-green-800"
                : "bg-red-100 dark:bg-red-800"
            }`}
            aria-label={`Session ${index + 1}`}
          >
            <article>
              <p><strong>Session:</strong> {session.tab}</p>
              <p><strong>Completion Time:</strong> {session.completionTime}</p>
              <p><strong>Status:</strong> {session.status}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

States.propTypes = {
  sessionData: PropTypes.arrayOf(
    PropTypes.shape({
      tab: PropTypes.string.isRequired,
      completionTime: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
};

export default States;
