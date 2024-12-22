import React from "react";

const Header = ({ isDarkMode, toggleTheme }) => (
  <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
    <h1 className="font-bold text-2xl">Pomodoro Timer</h1>
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-yellow-400"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  </header>
);

export default Header;