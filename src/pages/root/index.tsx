import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";
import { isLoggedIn } from "../../utils";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./root.css";

// This is just a placeholder. You would replace this with your actual authentication logic.

interface RootPageProps {
    children?: ReactNode;
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#3C80D0"
        },
        text: {
            primary: "#FAFAFA",
            secondary: "rgba(255, 255, 255, 0.7)" // Change text color to white
        },
        background: {
            default: "#fff" // Change background color to black
        },
        secondary: {
            main: "#3C80D0"
        },
        mode: "dark"
    }
});

const RootPage: FC<RootPageProps> = ({ children }) => (
    <ThemeProvider theme={theme}>
        <header className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="navbar-right">
                {isLoggedIn() ? (
                    <>
                        <Link to="/schedule" className="text-primary">
                            Schedule
                        </Link>
                        <Link to="/people" className="text-primary">
                            People
                        </Link>
                        <Link to="/courses" className="text-primary">
                            Courses
                        </Link>
                        <Link to="/profile" className="text-primary">
                            Profile
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-primary">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
            <p>© 2024 Attendunce. All rights reserved.</p>
        </footer>
    </ThemeProvider>
);

export default RootPage;
