import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AppRouter from "./routes";
import "./index.css";

// Make sure there's a div with id="root" in your index.html
const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<RouterProvider router={AppRouter} />);
} else {
    console.error("Failed to find the root element");
}
