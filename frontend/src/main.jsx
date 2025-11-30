// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

const container = document.getElementById("root");

if (!container) {
  console.error('Root container not found. Make sure index.html has <div id="root"></div>');
} else {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </React.StrictMode>
  );
}
