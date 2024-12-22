import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";
import Login from "./components/pages/Login"; // Import the Login component

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className={`w-96 h-48 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"} h-screen flex flex-col`}>
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => {
          setIsLoggedIn(false);
          setSessionData([]);
        }}
      />
      <main className="flex-1 p-4">
        {isLoggedIn ? (
          <>
            <Home setSessionData={setSessionData} />
            <States sessionData={sessionData} />
          </>
        ) : (
          <Login
            onLoginSuccess={(data) => {
              setIsLoggedIn(true);
              setSessionData(data);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;