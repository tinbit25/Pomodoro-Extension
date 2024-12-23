import React, { useState } from "react";
import { motion } from "framer-motion";
import { User,Loader, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../Input";
import axios from "axios"; 
import { FaSpinner } from 'react-icons/fa';

const Signup = ({onSignupSuccess}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (email, password) => {
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      console.log("Signup Response Data:", data);
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        onSignupSuccess(); // Call the parent callback
      } else {
        setError(data.message || "Error occurred during signup.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-700 bg-opacity-50 rounded-2xl overflow-hidden p-8 mx-auto mt-10"
      >
        <h2 className="text-lg font-bold text-green-950 text-center mb-4">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <motion.button
            className="w-full p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={"/login"} className="text-green-400 hover-underline">
              login
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;
