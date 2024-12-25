import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token (or other authentication data)
    localStorage.removeItem("token");

    
    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800 text-white">
      <h2 className="text-xl font-bold">Logging out...</h2>
    </div>
  );
};

export default Logout;
