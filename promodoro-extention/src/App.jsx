import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ForgotPassword from "./components/pages/ForgotPassword";
import Logout from "./components/pages/Logout";
import ResetPassword from "./components/pages/ResetPassword";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Check login status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set login state to true
    navigate("/"); // Navigate to the home page after successful login
  };

  const handleSignupSuccess = () => {
    navigate("/login"); // Redirect to login page after successful signup
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      } w-96 h-full flex flex-col`}
    >
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-4">
        <Routes>
          <Route
            path="/"
            element={<Home setSessionData={setSessionData} />}
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={handleSignupSuccess} />}
          />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
