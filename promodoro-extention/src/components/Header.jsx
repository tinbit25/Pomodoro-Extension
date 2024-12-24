import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

const Header = ({ isDarkMode, toggleTheme, isLoggedIn, onLogout, userProfile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include", // Include credentials (cookies)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message); // Logged out successfully
            // Redirect to the login page or home page
            navigate("/login");
        } else {
            console.error(data.message); // Handle error response
        }
    } catch (error) {
        console.error("An error occurred during logout:", error);
    }
};


  const handleProfileMenuItemClick = (item) => {
    setShowProfileMenu(false); // Close the profile menu after selection

    // Navigate to the corresponding page based on the menu item
    if (item === "Logout") {
      handleLogout(); 
      navigate("/login");
    } else if (item === "Profile") {
      navigate("/profile"); // Navigate to the Profile page
    } else if (item === "States") {
      navigate("/status"); // Navigate to the States page
    }
  };

  return (
    <header className="z-10 flex items-center justify-between px-4 py-2 border-b">
      <h1 className="text-xl font-bold">
        <Link to="/">Pomodoro Timer</Link>
      </h1>
      <div className="flex items-center space-x-4">
        <button
          className={`px-3 py-1 rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
          onClick={toggleTheme}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <div className="relative">
            {/* Profile Section */}
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="rounded-full w-10 h-10 overflow-hidden border border-gray-300 dark:border-gray-600"
              aria-label="Open Profile Menu"
            >
              <img
                src={userProfile?.avatar || "https://i.pravatar.cc/300"} // User avatar or placeholder
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg py-2 w-48">
                {["Profile", "States", "Logout"].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleProfileMenuItemClick(item)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => navigate("/login")} // Navigate to the login page if not logged in
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
