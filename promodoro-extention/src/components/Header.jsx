import React from "react";
import PropTypes from "prop-types";

const Header = ({ isDarkMode, toggleTheme, isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b flex-wrap">
      <h1 className="text-xl font-bold">Pomodoro Timer</h1>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <button
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          className={`px-3 py-1 rounded transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
          onClick={toggleTheme}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <button
            className="px-3 py-1 bg-red-500 text-white rounded transition duration-300 hover:bg-red-700"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="px-3 py-1 bg-green-500 text-white rounded transition duration-300 hover:bg-green-700"
            onClick={onLogin}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
