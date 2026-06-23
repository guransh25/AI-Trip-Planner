// src/main.jsx
// This is where React "mounts" onto the HTML page
// It finds the <div id="root"> and renders the App component inside it
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode runs checks in development to catch potential issues
  // It doesn't affect production
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
