import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Mail } from "lucide-react";
import { useNavigate,Link } from "react-router-dom";
import Input from "../components/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Check your email for password reset instructions.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
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
      className="max-w-md w-full bg-gray-700 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-xl shadow-xl overflow-hidden p-8 mx-auto mt-10"
    >
      <h2 className="text-lg font-bold text-green-950 text-center mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <Input
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 font-semibold mb-2">{successMessage}</p>}
        <motion.button
          className="w-full m-3 p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Send Reset Link"}
        </motion.button>
      </form>
      <div className="flex px-8 py-4 bg-gray-900 bg-opacity-50 justify-center">
        <p className="text-sm text-gray-400">
          Remembered your password?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
