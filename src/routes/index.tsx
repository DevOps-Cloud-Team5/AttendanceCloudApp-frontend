import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import Profile from "../pages/profile";
import People from "../pages/people";
import Courses from "../pages/courses";
import { isLoggedIn } from "../utils";
import ResetPassword from "../pages/reset_password";

// Create router
const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: isLoggedIn() ? (
            <Navigate to="/home" replace />
        ) : (
            <Navigate to="/login" replace />
        )
    },
    {
        path: "/login",
        element: isLoggedIn() ? <Navigate to="/home" replace /> : <LoginPage />
    },
    {
        path: "/home",
        element: isLoggedIn() ? <HomePage /> : <Navigate to="/login" replace />
    },
    {
        path: "/profile",
        element: isLoggedIn() ? <Profile /> : <Navigate to="/login" replace />
    },
    {
        path: "/profile/:id",
        element: isLoggedIn() ? <Profile /> : <Navigate to="/login" replace />
    },
    {
        path: "/create_user",
        element:
            isLoggedIn() && IsAdmin() ? (
                <CreateUser />
            ) : (
                <Navigate to="/login" replace />
            )
    },
    {
        path: "/people",
        element: isLoggedIn() ? <People /> : <Navigate to="/login" replace />
    },
    {
        path: "/courses",
        element: isLoggedIn() ? <Courses /> : <Navigate to="/login" replace />
    },
    {
        path: "/reset_password",
        element: isLoggedIn() ? (
            <ResetPassword />
        ) : (
            <Navigate to="/login" replace />
        )
    }
]);
export default AppRouter;
