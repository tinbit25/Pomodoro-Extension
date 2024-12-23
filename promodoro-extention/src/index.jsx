import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Your App component

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* Wrap your entire app in BrowserRouter here */}
    <App />
  </BrowserRouter>
);
