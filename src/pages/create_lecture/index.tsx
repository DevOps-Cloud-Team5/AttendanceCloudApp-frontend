import React, { useState } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

import RootPage from "../root";
import "./create.css"; // Import CSS file for additional styling
import { backend_post } from "../../utils";
import { useParams } from "react-router-dom";
import moment from "moment";

const CreateLecture = () => {
    // const navigate = useNavigate();
    const [regStatus, setRegStatus] = useState("");
    const { id } = useParams();

    // TODO: Add first and last name validation
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setRegStatus("submitting");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const start_time = data.get("start_time");
        const end_time = data.get("end_time");

        if (start_time == null || end_time == null) return;
        if (start_time == "" || end_time == "") return;

        const start_date = moment(start_time.toString()).utc();
        const end_date = moment(end_time.toString()).utc();

        backend_post(
            "course/lecture/" + id + "/add",
            JSON.stringify({
                start_time: start_date.toISOString(),
                end_time: end_date.toISOString(),
                lecture_type: data.get("lecture_type"),
                lecture_series: data.get("lecture_series") == "on"
            })
        )
            .then((resp) => {
                if (resp.ok) {
                    setRegStatus("success");
                } else {
                    setRegStatus("failed");
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
                        <AppRegistrationIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Lecture
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                        color={"primary"}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDateTimePicker
                                label="Start time"
                                name="start_time"
                                slotProps={{ textField: { required: true } }}
                            />
                            <DesktopDateTimePicker
                                label="End time"
                                name="end_time"
                                slotProps={{ textField: { required: true } }}
                            />
                        </LocalizationProvider>
                        <Select
                            color="primary"
                            required
                            fullWidth
                            id="lecture_type"
                            name="lecture_type"
                            autoComplete="lecture_type"
                            autoFocus
                            defaultValue="lecture"
                        >
                            <MenuItem value="lecture">Lecture</MenuItem>
                            <MenuItem value="practical">Practical</MenuItem>
                            <MenuItem value="workshop">Workshop</MenuItem>
                            <MenuItem value="exam">Exam</MenuItem>
                        </Select>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="lecture_series"
                                    name="lecture_series"
                                />
                            }
                            label="Create Lecture Series"
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

export default CreateLecture;
