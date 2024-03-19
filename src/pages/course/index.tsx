import { useState, useEffect } from "react";
import RootPage from "../root";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import "./course.css"; // Import CSS file for additional styling

import {
    IsStudent,
    IsAdmin,
    backend_get,
    deleteAuthCookies,
    useAxiosRequest,
    backend_post
} from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
import {
    CookieJWT,
    Empty,
    FullCourse,
    FullCourseUser
} from "../../types/common";
import { Avatar, Button, IconButton, capitalize, styled } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { render } from "@testing-library/react";

const Course = () => {
    const { response, error, loading, sendRequest } = useAxiosRequest<
        Empty,
        FullCourse
    >();
    const navigate = useNavigate();
    const { id } = useParams();

    const [courseData, setCourseData] = useState<FullCourse>();

    const getCourseData = () => {
        sendRequest({
            method: "GET",
            route: `/course/get/${id}`,
            useJWT: true
        });
    };

    useEffect(() => {
        getCourseData();
    }, [sendRequest]);

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

    const showAttendenceStats = () => {
        return (
            IsStudent() &&
            courseData?.attended != -1 &&
            courseData?.missed != -1
        );
    };

    const handleEnrollment = (enroll: boolean) => {
        let url = "course/enroll/" + id;
        if (!enroll) url = "course/disenroll/" + id;
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
                        {!IsAdmin() ? (
                            courseData?.enrolled == true ? (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleEnrollment(false);
                                    }}
                                    style={{
                                        marginBottom: "5%",
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
                                        marginBottom: "5%",
                                        textTransform: "none"
                                    }}
                                >
                                    Enroll
                                </Button>
                            )
                        ) : null}

                        <Button
                            variant="contained"
                            style={{ textTransform: "none" }}
                            onClick={() => navigate(`/course/${id}/schedule`)}
                        >
                            Schedule
                        </Button>
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
                                    <th className="actions-column">Actions</th>
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
                                                <IconButton>
                                                    <MoreVertIcon />
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
