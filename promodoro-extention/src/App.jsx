import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirects

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/"); // If token exists, navigate to home
    }
  }, [navigate]);

  return (
    <div
      className={`${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      } w-full h-screen flex flex-col`}
    >
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => {
          setIsLoggedIn(false);
          setSessionData(null);
          localStorage.removeItem("token"); // Clear token on logout
        }}
      />
      <main className="flex-1 p-4">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <Home setSessionData={setSessionData} />
                  <States sessionData={sessionData} />
                </>
              ) : (
                <Login
                  onLoginSuccess={() => navigate("/")} // Navigate after successful login
                />
              )
            }
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={() => navigate("/")} />} // Navigate after successful signup
          />
          <Route path="/login" element={<Login onLoginSuccess={() => navigate("/")} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
