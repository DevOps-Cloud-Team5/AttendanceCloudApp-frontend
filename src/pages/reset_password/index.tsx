import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import RootPage from "../root";
import "./reset_password.css"; // Import CSS file for additional styling
import { useAxiosRequest } from "../../utils";
import { Empty } from "../../types/common";

interface ChangePasswordRequestParams {
    token: string;
    password: string;
}
interface ValidateTokenRequestParams {
    token: string;
}
interface ValidateTokenRequestResponse {
    detail?: string;
    status?: string;
}

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(true);

    // API Request
    const ChangePassword = useAxiosRequest<
        ChangePasswordRequestParams,
        Empty
    >();
    const ValidateToken = useAxiosRequest<
        ValidateTokenRequestParams,
        ValidateTokenRequestResponse
    >();
    const validateRequest = ValidateToken.sendRequest;

    // Get the token from query
    const queryParams = new URLSearchParams(location.search);
    let token = queryParams.get("token");
    if (token == null) token = "";

    useEffect(() => {
        if (token === "") {
            navigate("/login");
            navigate(0);
        }
        const tokenParam: ValidateTokenRequestParams = {
            token: token
        };
        validateRequest({
            method: "POST",
            route: "password_reset/validate_token",
            data: tokenParam,
            useJWT: false
        });
    }, [navigate, token, validateRequest]);

    useEffect(() => {
        if (ValidateToken.error != null) {
            navigate("/login");
            navigate(0);
        }
    }, [navigate, ValidateToken.error]);

    useEffect(() => {
        if (ValidateToken.loading) {
            setLoading(false);
        }
    }, [ValidateToken.loading]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Reset error state
        setPasswordError("");

        // Basic client-side validations
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return;
        }

        // Basic common password check (for demonstration; consider using a list)
        const commonPasswords = ["password", "12345678", "qwerty"];
        if (commonPasswords.includes(newPassword.toLowerCase())) {
            setPasswordError("Password is too common.");
            return;
        }

        // Check if the password is entirely numeric
        if (/^\d+$/.test(newPassword)) {
            setPasswordError("Password cannot be entirely numeric.");
            return;
        }
        const requestParams: ChangePasswordRequestParams = {
            token: token,
            password: newPassword
        };

        ChangePassword.sendRequest({
            method: "POST",
            route: "/password_reset/confirm/",
            data: requestParams,
            useJWT: false
        })
            .then(() => {
                navigate("/login");
                navigate(0);
            })
            .catch((error) => {
                console.error("Password reset request failed:", error);
                setPasswordError("Failed to reset password. Please try again.");
            });
    };

    return (
        <RootPage>
            <Container component="main" maxWidth="xs">
                {loading || ValidateToken.loading ? (
                    <div>Loading...</div> // Added loading state feedback
                ) : (
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Change Password
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                            color={"primary"}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="new_password"
                                label="New Password"
                                type="password"
                                id="new_password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirm_password"
                                label="Confirm Password"
                                type="password"
                                id="confirm_password"
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Change Password
                            </Button>
                            {passwordError && (
                                <Typography color="error" textAlign="center">
                                    {passwordError}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Container>
        </RootPage>
    );
};

export default ResetPassword;
