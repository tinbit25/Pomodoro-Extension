import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../public/icon1.png";

const Header = ({
  isDarkMode,
  toggleTheme,
  isLoggedIn,
  onLogout,
  userProfile,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); 
        
        navigate("/login");
        onLogout(); 
      } else {
        console.error(data.message); 
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleProfileMenuItemClick = (item) => {
    setShowProfileMenu(false); 

    if (item === "Logout") {
      handleLogout();
    
    } else if (item === "Status") {
      navigate("/status"); 
    }
  };

  return (
    <header className="z-10 flex items-center justify-between px-4 py-2 border-b">
      <h1 className="text-xl font-bold">
        <Link className="flex" to="/">
          <img className="rounded-full" src={logo} alt="Pomodoro Timer Logo" />
          <h6 className="pt-2">Pomodoro Timer</h6>
        </Link>
      </h1>
      <div className="flex items-center space-x-4">
        <button
          className={`px-3 py-1 bg-transparent text-2xl ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
          onClick={toggleTheme}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="rounded-full w-10 h-10 overflow-hidden border border-gray-300 dark:border-gray-600"
              aria-label="Open Profile Menu"
            >
              <img
                src={userProfile?.avatar || "https://i.pravatar.cc/300"} 
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg py-2 w-48">
                {["Status", "Logout"].map((item) => (
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
            onClick={() => navigate("/login")} 
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
