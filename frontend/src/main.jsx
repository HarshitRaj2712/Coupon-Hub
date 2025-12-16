// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

// ✅ Set default theme (dark: black + dark purple)
document.documentElement.setAttribute("data-theme", "dark");

const container = document.getElementById("root");

if (!container) {
  console.error(
    'Root container not found. Make sure index.html has <div id="root"></div>'
  );
} else {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
      {/* Toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </React.StrictMode>
  );
}
