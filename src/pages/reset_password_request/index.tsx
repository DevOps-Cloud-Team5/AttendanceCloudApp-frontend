import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import RootPage from "../root";
import "./reset_password_request.css"; // Import CSS file for additional styling
import { useAxiosRequest } from "../../utils";
import { Empty } from "../../types/common";

interface RequestParams {
    email: string;
}
const ResetPasswordRequest = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const { sendRequest } = useAxiosRequest<RequestParams, Empty>();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const requestParams: RequestParams = {
            email: email
        };

        sendRequest({
            method: "POST",
            route: "/password_reset/",
            data: requestParams,
            useJWT: false
        })
            .then(() => {
                navigate("/password_reset_requested");
                navigate(0);
            })
            .catch((error) => {
                console.error("Password reset request failed:", error);
            });
    };

    return (
        <RootPage>
            <Container component="main" maxWidth="xs">
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
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            color="primary"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Request Password Reset
                        </Button>
                    </Box>
                </Box>
            </Container>
        </RootPage>
    );
};

export default ResetPasswordRequest;
