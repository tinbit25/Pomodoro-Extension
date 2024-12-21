import React from "react";

const Sidebar = ({ isDarkMode }) => (
  <div
    className={`fixed top-0 left-0 h-full w-48 bg-gray-800 text-white p-4 ${isDarkMode ? "dark" : ""}`}
  >
    <nav>
      <p className="font-bold">Pomodoro Timer</p>
    </nav>
  </div>
);

export default Sidebar;