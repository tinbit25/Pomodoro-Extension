import React from "react";

const Header = ({ isDarkMode, toggleTheme, profilePic }) => (
  <header
    className={`py-2 px-4 flex justify-between items-center shadow-md w-full ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
    }`}
  >
    {/* Left: Logo and Name */}
    <div className="flex items-center space-x-2">
      <img
        src="/path/to/logo.png" // Replace with your actual logo path
        alt="Logo"
        className="w-8 h-8"
      />
      <span className="text-lg font-semibold">Pro-Me</span>
    </div>

    {/* Right: Profile Picture and Theme Toggle */}
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleTheme}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          isDarkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-300 text-yellow-500"
        }`}
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? "🌙" : "☀️"}
      </button>
      <img
        src={profilePic || "/path/to/default-profile.png"} // Add a default profile picture path
        alt="Profile"
        className="w-8 h-8 rounded-full border-2 border-gray-500"
      />
    </div>
  </header>
);

export default Header;
