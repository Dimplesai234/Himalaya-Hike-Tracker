import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/*
  main.jsx is the entry point of the React frontend.
  It imports the global stylesheet, initializes the React application,
  and renders the root App component inside the HTML root element.
  StrictMode helps identify potential problems during development.
 */

// Find the root HTML element and initialize the React application.
createRoot(document.getElementById("root")).render(
  // Enable additional development checks provided by React.
  <StrictMode>
    {/* Render the main application and its child components. */}
    <App />
  </StrictMode>
);
