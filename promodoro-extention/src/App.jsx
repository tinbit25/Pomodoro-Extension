import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState([]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div
      className={`w-[360px] h-[600px] ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      } flex flex-col shadow-lg border border-gray-300`}
    >
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        profilePic="/path/to/user-profile.jpg" // Replace with an actual image path or user profile URL
      />
      <main className="flex-1 p-2 overflow-y-auto">
        <Home setSessionData={setSessionData} />
        <States sessionData={sessionData} />
      </main>
    </div>
  );
};

export default App;
