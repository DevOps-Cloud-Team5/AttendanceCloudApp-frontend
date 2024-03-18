import { Link } from "react-router-dom";

import Container from "@mui/material/Container";
import RootPage from "../root";
import "./reset_password_requested.css"; // Import CSS file for additional styling

const PasswordResetRequested = () => (
        <RootPage>
            <Container component="main" maxWidth="xs" className="pw-reset-form">
                <div>
                    <h2>Password Reset Requested</h2>
                    <p>
                        If an account exists for the email address you entered,
                        you will receive a password reset email shortly. Please
                        check your email inbox and follow the instructions to
                        reset your password.
                    </p>
                    <p>
                        If you don't receive an email, please make sure to check
                        your spam or junk email folder.
                    </p>
                    <Link to="/login">Return to Login</Link>
                </div>
            </Container>
        </RootPage>
    );

export default PasswordResetRequested;
