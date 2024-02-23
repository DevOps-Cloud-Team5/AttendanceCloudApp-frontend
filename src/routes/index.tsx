import {
    createBrowserRouter,
    Navigate
} from "react-router-dom";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";

// Create router
const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/home" replace />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/home",
        element: <HomePage />
    }
]);
export default AppRouter;