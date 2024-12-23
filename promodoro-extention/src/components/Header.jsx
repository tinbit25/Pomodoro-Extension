import React from "react";
import {Link} from "react-router-dom";

const Header = ({ isDarkMode, toggleTheme, isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <h1 className="text-xl font-bold">Pomodoro Timer</h1>
      <div className="flex items-center space-x-4">
        <button
          className={`px-3 py-1 rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
          onClick={toggleTheme}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <Link to="/logout">
          <button
          
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={onLogout}
          >
            Logout
          </button>
          </Link>
        ) : (
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={onLogin}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;


