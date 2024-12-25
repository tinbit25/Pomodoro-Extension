import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, UserPlus ,Mail,Lock} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";

const Signup = ({ onSignupSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (name, email, password) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onSignupSuccess();
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err); 
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
      <h2 className="text-lg font-bold text-green-950 text-center mb-4">Create an Account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup(e.target.name.value, e.target.email.value, e.target.password.value);
        }}
      >
        <Input icon={UserPlus} label="Full Name" type="text" placeholder="Full Name" name="name" required />
        <Input icon={Mail} label="Email Address" type="email" placeholder="Email Address" name="email" required />
        <Input icon={Lock} label="Password" type="password" placeholder="Password" name="password" required />

        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

        <motion.button
          className="w-full m-3 p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Sign Up"}
        </motion.button>
      </form>

      <div className="flex px-8 py-4 bg-gray-900 bg-opacity-50 justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
