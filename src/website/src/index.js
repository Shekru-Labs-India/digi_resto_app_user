import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./Assets/Css/stylewebsite.css"
import "./Assets/Css/responsive.css"
// Get the root element from the DOM
const rootElement = document.getElementById("root");

// Create a root using createRoot and render your app
const root = createRoot(rootElement);
root.render(
    <BrowserRouter
    future={{
      v7_startTransition: true, // Opt into the startTransition behavior
      v7_relativeSplatPath: true, // Opt into the relative splat path behavior
    }}
  >
    <App />
  </BrowserRouter>
);



