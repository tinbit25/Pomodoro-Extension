import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = ({ isDarkMode, toggleTheme, toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <header className="bg-slate-400 text-white py-4 px-6 flex justify-between items-center dark:bg-gray-800">
      {/* Sidebar Toggle Button - Only for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="text-black dark:text-white text-3xl md:hidden"
        aria-label="Open Sidebar"
      >
        ☰
      </button>

      {/* App Title */}
      <h1 className="font-bold text-3xl">Pomodoro Timer</h1>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 shadow-md dark:bg-gray-700 dark:text-yellow-400 transition-colors duration-300"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="rounded-full w-10 h-10 overflow-hidden border border-gray-300 dark:border-gray-600"
            aria-label="Open Profile Menu"
          >
            <img
              src="https://i.pravatar.cc/300"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg py-2 w-48">
              {["Profile", "Logout"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
