import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isDarkMode, showSidebar, toggleSidebar }) => {
  const navigate = useNavigate();

  // Determine if the screen is wide
  const isWideScreen = window.innerWidth >= 768;

  const handleNavigation = (path) => {
    navigate(path);

    // Only close the sidebar on small screens
    if (!isWideScreen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {showSidebar && (
        <div
          className={`fixed top-0 left-0 h-full w-60 shadow-lg z-30 transition-transform duration-300
          ${isDarkMode ? "bg-gray-800 text-white" : "bg-slate-400 text-black"}`}
        >
          {/* Close Button - Only for Small Screens */}
          {!isWideScreen && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-3xl"
              aria-label="Close Sidebar"
            >
              ✖
            </button>
          )}

          {/* User Profile - stacked properly */}
          <div className="mt-6 px-4 flex items-center space-x-4">
            <img
              src="https://i.pravatar.cc/300"
              alt="User Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span>Username</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8">
            {[
              { name: "Home", path: "/" },
             
              { name: "Plan", path: "/plan" },
              // { name: "Settings", path: "/settings" },
              { name: "States", path: "/states" },
              { name: "Logout", path: "/logout" }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="block w-full text-left px-6 py-4 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
