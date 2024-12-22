// src/App.js
import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState([]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className={`w-96 h-48 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"} h-screen flex flex-col`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 p-4">
        <Home setSessionData={setSessionData} />
        <States sessionData={sessionData} />
      </main>
    </div>
  );
};

export default App;