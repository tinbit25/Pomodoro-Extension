// components/TabButton.js
import React from "react";

const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab.value)}
    aria-selected={activeTab === tab.value}
    className={`px-4 py-2 font-semibold transition-all duration-300 ${
      activeTab === tab.value ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
    }`}
  >
    {tab.label}
  </button>
);

export default TabButton;
