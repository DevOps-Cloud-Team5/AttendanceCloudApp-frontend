import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Box, FormControlLabel } from "@mui/material";

import RootPage from "../root";
import "./login.css"; // Import CSS file for additional styling
import { post_db, expire_time } from "../../utils";
import { TokenResponse } from "../../types/common";

const SignIn = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const handleTokenResponse = (data: TokenResponse) => {
        if ("detail" in data) {
            // TODO: Show wrong password, deny login
            return;
        }
        const expire_date = new Date(new Date().getTime() + expire_time * 1000);
        console.log(data);
        Cookies.set("token_access", data["access"], { expires: expire_date });
        Cookies.set("token_refresh", data["refresh"], { expires: expire_date });
        Cookies.set("token_spawned", (Date.now() / 1000).toString(), {
            expires: expire_date
        });
        navigate(0);
        navigate("/home", { replace: true });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get("username"),
            password: data.get("password")
        });

        post_db(
            "token/",
            JSON.stringify({
                username: data.get("username"),
                password: data.get("password")
            })
        )
            .then((resp) => resp.json())
            .then((data) => handleTokenResponse(data))
            .catch((error) => console.log(error));
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
                        Sign in
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
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            color="primary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </RootPage>
    );
};

export default SignIn;
