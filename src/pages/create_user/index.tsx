import React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, MenuItem, Select } from "@mui/material";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import RootPage from "../root";
import "./create.css"; // Import CSS file for additional styling
import { post_db } from "../../utils";

const CreateUser = () => {
    // const navigate = useNavigate();

    const handleTokenResponse = (data: any) => {
        console.log(data);
        if ("detail" in data) {
            // TODO: Show wrong password, deny login
            return;
        }

        // navigate(0);
        // navigate("/home", { replace: true });
    };

    // TODO: Add first and last name validation
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const first_name = data.get("first_name");
        const last_name = data.get("last_name");

        let username = data.get("username");
        let email = data.get("email");

        if (username == "") username = first_name + "." + last_name;
        if (email == "") email = first_name + "." + last_name + "@uni.org";

        post_db(
            "user/register/",
            JSON.stringify({
                username: username,
                password: data.get("password"),
                first_name: first_name,
                last_name: last_name,
                email: email,
                role: data.get("role")
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
                        <HowToRegOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register User
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
                            id="first_name"
                            label="First Name"
                            name="first_name"
                            autoComplete="first_name"
                            autoFocus
                            color="primary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            autoComplete="last_name"
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
                        <TextField
                            margin="normal"
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
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            color="primary"
                        />
                        <Select
                            color="primary"
                            required
                            fullWidth
                            id="role"
                            name="role"
                            autoComplete="role"
                            autoFocus
                            label="Role"
                            defaultValue="Student"
                        >
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Teacher">Teacher</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
            </Container>
        </RootPage>
    );
};

export default CreateUser;
