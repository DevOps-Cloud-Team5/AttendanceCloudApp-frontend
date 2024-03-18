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
    useAxiosRequest
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

const Course = () => {
    const { response, error, loading, sendRequest } = useAxiosRequest<
        Empty,
        FullCourse
    >();
    const navigate = useNavigate();
    const { id } = useParams();

    const [courseData, setCourseData] = useState<FullCourse>();

    useEffect(() => {
        sendRequest({
            method: "GET",
            route: `/course/get/${id}`,
            useJWT: true
        });
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
        return IsStudent() && courseData?.attended != -1 && courseData?.missed != -1
    }

    return (
        <RootPage>
            <Container component="main" className="course" maxWidth="md">
                <div className="course-info">
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
                                <span className="label">Lectures Missed:</span>
                                {courseData?.missed}
                            </p>
                        </>
                    ) : null}
                </div>
                
                <div><Button variant="contained">Enroll Course</Button></div>
                <div><Button variant="contained">Schedule</Button></div>

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
