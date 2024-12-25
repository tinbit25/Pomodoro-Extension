import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Status from "./pages/StatusPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Logout from "./pages/Logout";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Toggle theme (dark mode)
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Check login status and user ID when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Set user as logged in if token exists
    }

    const storedUserId = localStorage.getItem("userId"); // Retrieve userId from local storage
    console.log("User  ID from local storage:", storedUserId); // Log the userId
    setUserId(storedUserId); // Set the userId state
  }, []);

  // Handle login success and redirect
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    localStorage.setItem("userId", userData._id); // Store userId in local storage
    setUserId(userData._id); // Update userId state immediately
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
    localStorage.removeItem("userId"); // Remove userId from local storage
    setUserId(null); // Reset userId state
    navigate("/login"); // Redirect to login page after logout
  };

  // Handle session complete (update session data)
  const handleSessionComplete = (sessionDetails) => {
    setSessionData(sessionDetails); // Set session data here
    console.log("Session Completed: ", sessionDetails);
  };

  return (
    <div
      className={`w-96 h-full flex flex-col rounded-xl transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
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
            element={
              <Home
                isDarkMode={isDarkMode}
                handleSessionComplete={handleSessionComplete}
                userId={userId} // Pass userId to Home
              />
            }
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={handleSignupSuccess} />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/forgot-password " element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/status" element={<Status sessionData={sessionData} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;