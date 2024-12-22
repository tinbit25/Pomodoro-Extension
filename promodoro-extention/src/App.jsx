import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import States from "./components/pages/States";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from 'react-router-dom';
import Input from './components/Input';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState(""); // To store error messages, if any

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleLogin = async (email, password) => {
    setIsLoading(true); // Set loading to true when login starts
    setError(""); // Clear any previous errors

    try {
      // Simulate login logic (replace with actual API call or authentication logic)
      const result = await fakeLogin(email, password); // Replace with your login function
      if (result.success) {
        setIsLoggedIn(true);
        setSessionData(result.data); // Save session data if login is successful
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false when login finishes
    }
  };

  // Simulating login function (replace with real one)
  const fakeLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password123") {
          resolve({ success: true, data: { email } });
        } else {
          resolve({ success: false });
        }
      }, 2000); // Simulate a 2-second delay for the login
    });
  };

  return (

    <div className={`w-96 h-48 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"} h-screen flex flex-col`}>
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => { setIsLoggedIn(false); setSessionData([]); }}
      />
      <main className="flex-1 p-4">
        {isLoggedIn ? (
          <>
            <Home setSessionData={setSessionData} />
            <States sessionData={sessionData} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full bg-gray-700 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-xl shadow-xl overflow-hidden p-8 mx-auto mt-10"
            >
              <h2 className="text-lg font-bold text-green-950 text-center mb-4">
                Welcome 
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(e.target.email.value, e.target.password.value);
                }}
              >
                <Input
                  icon={Mail}
                  type="text"
                  placeholder="Email Address"
                  name="email"
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
                <motion.button
                  className="w-full m-3 p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  type="submit"
                  disabled={isLoading} // Disable button during loading
                >
                  {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
                </motion.button>
              </form>
              <div className="flex flex-col h-full">
                <div className="flex px-8 py-4 bg-gray-900 bg-opacity-50 justify-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to={'/signup'} className="text-green-400 hover:underline">Signup</Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
