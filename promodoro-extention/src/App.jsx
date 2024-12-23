import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import Status from "./components/pages/StatusPage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ForgotPassword from "./components/pages/ForgotPassword";
import Logout from "./components/pages/Logout";
import ResetPassword from "./components/pages/ResetPassword";
import Profile from "./components/pages/Profile";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Toggle theme (dark mode)
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Check login status when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Set user as logged in if token exists
    }
  }, []);

  // Handle login success and redirect
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/"); // Redirect to home page after login
  };

  // Handle signup success and redirect
  const handleSignupSuccess = () => {
    navigate("/login"); // Redirect to login page after signup
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page after logout
  };

  // Handle session complete (update session data)
  const handleSessionComplete = (sessionDetails) => {
    // Update session data (this could be stored in a database or displayed on the status page)
    setSessionData(sessionDetails);
    console.log("Session Completed: ", sessionDetails);
  };

  return (
    <div
      className={`${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      } w-96 h-full flex flex-col rounded-xl transition-colors duration-300`}
    >
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 p-4">
        <Routes>
          <Route
            path="/"
            element={<Home handleSessionComplete={handleSessionComplete} />}
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={handleSignupSuccess} />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/status" element={<Status sessionData={sessionData} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
