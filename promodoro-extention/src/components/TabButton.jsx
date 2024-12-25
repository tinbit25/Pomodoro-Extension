
import React from "react";

const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab.value)}
    aria-selected={activeTab === tab.value}
    className={`px-6 py-3 text-lg font-semibold transition-all duration-300 rounded-lg ${activeTab === tab.value ? "border-b-4 border-blue-500 text-blue-500 bg-gradient-to-r from-indigo-100 via-blue-200 to-indigo-300" : "text-gray-0 hover:text-blue-900 hover:bg-indigo-50"}`}
  >
    {tab.label}
  </button>
);


export default TabButton;
