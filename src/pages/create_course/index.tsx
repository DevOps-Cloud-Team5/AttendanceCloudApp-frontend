import React, { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, MenuItem, Select } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import RootPage from "../root";
import "./create.css"; // Import CSS file for additional styling
import { backend_post } from "../../utils";
// import { post_db } from "../../utils";

const CreateCourse = () => {
    // const navigate = useNavigate();
    const [regStatus, setRegStatus] = useState("");

    const handleResponse = (
        data: any,
        event: React.FormEvent<HTMLFormElement>
    ) => {
        console.log(data);
        if (
            !("course_name" in data) ||
            typeof data["course_name"] !== "string"
        ) {
            setRegStatus("failed");
            return;
        } else {
            setRegStatus("success");
        }
    };

    // TODO: Add first and last name validation
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setRegStatus("submitting");
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        backend_post(
            "course/create/",
            JSON.stringify({
                course_name: data.get("course_name")
            })
        )
            .then((resp) => resp.json())
            .then((data) => handleResponse(data, event))
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
                        <AppRegistrationIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Course
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
                            id="course_name"
                            label="Course Name"
                            name="course_name"
                            autoComplete="course_name"
                            autoFocus
                            color="primary"
                        />

                        {regStatus === "success" && (
                            <Typography variant="body1" color="success">
                                Creation successful!
                            </Typography>
                        )}
                        {regStatus === "failed" && (
                            <Typography variant="body1" color="error">
                                Creation failed. Please try again.
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
                    </Box>
                </Box>
            </Container>
        </RootPage>
    );
};

export default CreateCourse;
