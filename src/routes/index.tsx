import {
    createBrowserRouter,
    Navigate
} from "react-router-dom";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import { isLoggedIn } from "../utils";

// Create router
const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: isLoggedIn() ? <Navigate to="/home" replace /> : <LoginPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/home",
        element: isLoggedIn() ? <HomePage /> : <LoginPage />
    }
]);
export default AppRouter;