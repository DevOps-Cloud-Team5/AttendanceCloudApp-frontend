import { FC, ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./root.css";
import Navbar from "../../components/navbar";

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
        mode: "light"
    }
});

const RootPage: FC<RootPageProps> = ({ children }) => (
    <ThemeProvider theme={theme}>
        <Navbar></Navbar>

        <main>{children}</main>

        <footer className="footer">
            <p>© 2024 Attendunce. All rights reserved.</p>
        </footer>
    </ThemeProvider>
);

export default RootPage;
