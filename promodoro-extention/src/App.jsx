// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/pages/Home";
import States from "./components/pages/States";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 768);
  const [sessionData, setSessionData] = useState([]);

  // Load session data from localStorage on component mount
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("sessionData"));
    if (savedSessions) setSessionData(savedSessions);
  }, []);

  // Save completed session to localStorage
  const handleSessionComplete = (sessionInfo) => {
    const updatedSessionData = [...sessionData, sessionInfo];
    setSessionData(updatedSessionData);
    localStorage.setItem("sessionData", JSON.stringify(updatedSessionData));
  };

  // Toggle dark theme
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // Handle window resize
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 768);
    if (window.innerWidth >= 768) {
      setShowSidebar(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className={`flex ${isDarkMode ? "dark" : ""}`}>
        {/* Sidebar */}
        <Sidebar
          isDarkMode={isDarkMode}
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 md:ml-60 transition-all duration-300">
          <Header
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />
          <main className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    isDarkMode={isDarkMode}
                    handleSessionComplete={handleSessionComplete}
                  />
                }
              />
              <Route
                path="/states"
                element={<States sessionData={sessionData} />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;


