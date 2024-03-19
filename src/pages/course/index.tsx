import { useState, useEffect, useCallback } from "react";
import RootPage from "../root";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./course.css"; // Import CSS file for additional styling

import { IsStudent, IsAdmin, useAxiosRequest, backend_post } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { Empty, FullCourse, FullCourseUser } from "../../types/common";
import { Avatar, Button, IconButton, capitalize, styled } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const Course = () => {
    const { response, sendRequest } = useAxiosRequest<Empty, FullCourse>();
    const navigate = useNavigate();
    const { id } = useParams();

    const [courseData, setCourseData] = useState<FullCourse>();

    const getCourseData = useCallback(() => {
        sendRequest({
            method: "GET",
            route: `/course/get/${id}`,
            useJWT: true
        });
    }, [id, sendRequest]);

    useEffect(() => {
        getCourseData();
    }, [getCourseData]);

    useEffect(() => {
        if (response) setCourseData(response);
    }, [response]);

    const alternatingColor = ["#424242", "#595959"];

    const StyledTable = styled("table")({
        borderCollapse: "collapse",
        width: "100%",
        "& th, & tr": {
            padding: "8px",
            borderBottom: "1px solid #ddd",
            textAlign: "left"
        },
        "& td": {
            padding: "8px",
            textAlign: "left"
        },
        "& th": {
            fontWeight: "bold" // Add bold font weight to header cells if needed
        },
        "& .type-column": {
            width: "10%", // Adjust the width of the actions column
            textAlign: "left" // Align content to the left
        },
        "& .actions-column": {
            width: "5%", // Adjust the width of the actions column
            textAlign: "left" // Align content to the left
        },
        "& .avatar-column": {
            width: "5%", // Adjust the width of the avatar column
            textAlign: "left" // Align content to the left
        },
        "& .actions-icon": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    const handleProfileClick = (username: string) => {
        navigate(`/profile/${username}`);
    };

    const showAttendenceStats = () =>
        IsStudent() && courseData?.attended != -1 && courseData?.missed != -1;

    const handleEnrollment = (enroll: boolean, username: string = "") => {
        let url = "course/enroll/" + id;
        if (!enroll) url = "course/disenroll/" + id;
        if (username != "") url = `${url}/${username}`;
        backend_post(url, "", true).then((resp) => {
            if (resp.status == 200) {
                getCourseData();
            }
        });
    };

    return (
        <RootPage>
            <Container component="main" className="course" maxWidth="md">
                <div className="course-info">
                    <div className="course-data">
                        <Typography component="h1" variant="h5">
                            {courseData?.course_name}
                        </Typography>
                        <p>
                            <span className="label">Teachers:</span>
                            {courseData?.num_teachers}
                        </p>
                        <p>
                            <span className="label">Students:</span>
                            {courseData?.num_students}
                        </p>
                        {showAttendenceStats() ? (
                            <>
                                <p>
                                    <span className="label">
                                        Lectures Attended:
                                    </span>
                                    {courseData?.attended}
                                </p>
                                <p>
                                    <span className="label">
                                        Lectures Missed:
                                    </span>
                                    {courseData?.missed}
                                </p>
                            </>
                        ) : null}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "2%",
                            marginRight: "5%"
                        }}
                    >
                        <Button
                            variant="contained"
                            style={{
                                marginBottom: "5%",
                                textTransform: "none"
                            }}
                            onClick={() => navigate(`/course/${id}/schedule`)}
                        >
                            Schedule
                        </Button>

                        {!IsStudent() ? (
                            <Button
                                variant="contained"
                                style={{
                                    marginBottom: "5%",
                                    textTransform: "none"
                                }}
                                onClick={() =>
                                    navigate(`/course/${id}/create_lecture`)
                                }
                            >
                                Create Lecture
                            </Button>
                        ) : null}

                        {!IsAdmin() ? (
                            courseData?.enrolled == true ? (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleEnrollment(false);
                                    }}
                                    style={{
                                        textTransform: "none"
                                    }}
                                    sx={{
                                        "&.MuiButton-root:hover": {
                                            bgcolor: "red"
                                        }
                                    }}
                                >
                                    Enrolled
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleEnrollment(true);
                                    }}
                                    style={{
                                        textTransform: "none"
                                    }}
                                >
                                    Enroll
                                </Button>
                            )
                        ) : null}
                    </div>
                </div>

                <div style={{ marginTop: "7%" }}>
                    <Typography component="h1" variant="h5">
                        Enrolled People
                    </Typography>

                    <StyledTable>
                        <thead>
                            <tr>
                                <th className="avatar-column"></th>
                                <th>Name</th>
                                <th className="type-column">Role</th>
                                {IsAdmin() ? (
                                    <th className="actions-column">
                                        Disenroll
                                    </th>
                                ) : null}
                            </tr>
                        </thead>

                        <tbody>
                            {courseData?.users.map(
                                (user: FullCourseUser, index: number) => (
                                    <tr
                                        key={user.username}
                                        style={{
                                            backgroundColor:
                                                alternatingColor[index % 2]
                                        }}
                                    >
                                        <td className="avatar-column">
                                            <Avatar
                                                alt={`${user.first_name} ${user.last_name}`}
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                style={{
                                                    color: "white",
                                                    textTransform: "none",
                                                    fontSize: "1em"
                                                }}
                                                sx={{
                                                    "&.MuiButtonBase-root:hover":
                                                        {
                                                            bgcolor:
                                                                "transparent",
                                                            textDecoration:
                                                                "underline"
                                                        }
                                                }}
                                                onClick={() =>
                                                    handleProfileClick(
                                                        user.username
                                                    )
                                                }
                                            >
                                                {`${user.first_name} ${user.last_name}`}
                                            </Button>
                                        </td>
                                        <td style={{ fontSize: "1em" }}>
                                            {capitalize(user.role)}
                                        </td>
                                        {IsAdmin() ? (
                                            <td className="actions-icon">
                                                <IconButton
                                                    onClick={() => {
                                                        handleEnrollment(
                                                            false,
                                                            user.username
                                                        );
                                                    }}
                                                    sx={{
                                                        "&.MuiButtonBase-root:hover":
                                                            {
                                                                bgcolor:
                                                                    "transparent",
                                                                color: "red"
                                                            }
                                                    }}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </td>
                                        ) : null}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </StyledTable>
                </div>
            </Container>
        </RootPage>
    );
};

export default Course;
