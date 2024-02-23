import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AppRouter from "./routes";
import "./index.css";

// Make sure there's a div with id="root" in your index.html
const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <RouterProvider router={AppRouter} />
        </React.StrictMode>
    );
} else {
    console.error("Failed to find the root element");
}
