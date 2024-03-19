import React, { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, MenuItem, Select, capitalize } from "@mui/material";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import RootPage from "../root";
import "./create.css"; // Import CSS file for additional styling
import { backend_post } from "../../utils";
import { MuiFileInput } from "mui-file-input";
import * as Papa from "papaparse";
import { UserCSV } from "../../types/common";

const CreateUser = () => {
    // const navigate = useNavigate();
    const [regStatus, setRegStatus] = useState("");
    const [file, setFile] = useState<File | null>();

    const addUsersCSV = (parsed_users: any) => {
        const users: UserCSV[] = parsed_users.data;
        for (const user of users) {
            const first_name = capitalize(user.first_name);
            const last_name = capitalize(user.last_name);

            let password = user.password;
            let username = user.username;
            let email = user.email;
            let role = user.role;

            if (username == "" || username == null)
                username = first_name + "." + last_name;
            if (email == "" || email == null)
                email = first_name + "." + last_name + "@uni.org";

            if (username !== null) username = username.toString().toLowerCase();
            if (email !== null) email = email.toString().toLowerCase();
            if (role !== null) role = role.toString().toLowerCase();

            if (password == "" || password == null)
                password = "defaultpassword";
            if (role == "" || role == null) role = "student";

            backend_post(
                "user/register/",
                JSON.stringify({
                    username: username,
                    password: password,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    role: role
                })
            );
        }
    };

    const handleFileUpload = (newFile: File | null) => {
        if (newFile == null) return;
        setFile(newFile);
        Papa.parse(newFile, {
            complete: addUsersCSV,
            header: true
        });
    };

    // TODO: Add first and last name validation
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setRegStatus("submitting");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const first_name = data.get("first_name");
        const last_name = data.get("last_name");

        let username = data.get("username");
        let email = data.get("email");

        if (username == "") username = first_name + "." + last_name;
        if (email == "") email = first_name + "." + last_name + "@uni.org";

        if (username !== null) username = username.toString().toLowerCase();
        if (email !== null) email = email.toString().toLowerCase();

        backend_post(
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
            .then((data) => {
                if (
                    !("username" in data) ||
                    typeof data["username"] !== "string"
                ) {
                    setRegStatus("failed");
                    return;
                } else {
                    setRegStatus("success");
                }
            })
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
                            defaultValue="student"
                        >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>

                        {regStatus === "success" && (
                            <Typography variant="body1" color="success">
                                Registration successful!
                            </Typography>
                        )}
                        {regStatus === "failed" && (
                            <Typography variant="body1" color="error">
                                Registration failed. Please try again.
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                        <MuiFileInput
                            label="Import Users CSV"
                            value={file}
                            onChange={handleFileUpload}
                            style={{ textDecorationColor: "white" }}
                            inputProps={{ accept: ".csv" }}
                        />
                    </Box>
                </Box>
            </Container>
        </RootPage>
    );
};

export default CreateUser;
