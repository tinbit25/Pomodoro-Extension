import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response data:", data); 

      if (response.ok) {
        
        localStorage.setItem("user", JSON.stringify(data.user)); 
        localStorage.setItem("token", data.token); 
        localStorage.setItem("userId", data.user._id); 
      

        console.log("User  ID stored in local storage:", data.user._id);
      
        
        onLoginSuccess(data.user); 
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-700 bg-opacity-50 rounded-2xl shadow-xl p-8 mx-auto mt-10"
    >
      <h2 className="text-lg font-bold text-green-950 text-center mb-4">Welcome Back</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(e.target.email.value, e.target.password.value);
        }}
      >
        <Input icon={Mail} type="email" placeholder="Email Address" name="email" required />
        <Input icon={Lock} type="password" placeholder="Password" name="password" required />
        <Link to="/forgot-password" className="text-green-400 hover:underline mb-3">
          Forgot Password?
        </Link>
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
        <motion.button
          className="w-full p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
        </motion.button>
      </form>
      <div className="flex px-8 py-4 bg-gray-900 justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;