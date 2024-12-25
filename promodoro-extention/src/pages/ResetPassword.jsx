import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input';  // Assuming your Input component is in this path
import { Loader } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { token } = useParams();  // Get the token from the URL params
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Password has been successfully reset!');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
      <h2 className="text-lg font-bold text-green-950 text-center mb-4">Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          label="New Password"
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          label="Confirm Password"
        />
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 font-semibold mb-2">{successMessage}</p>}
        <motion.button
          className="w-full m-3 p-3 rounded-lg font-bold bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Reset Password"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
