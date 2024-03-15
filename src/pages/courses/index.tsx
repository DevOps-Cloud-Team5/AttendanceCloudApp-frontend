import RootPage from "../root";
import Container from "@mui/material/Container";
import "./courses.css"; // Import CSS file for additional styling
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_post, useAxiosRequest } from "../../utils";
import { Course, Empty } from "../../types/common";
import { IsAdmin } from "../../utils";
import { User } from "../../types/common";
import { Button, Checkbox, IconButton, Typography, styled } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Avatar from "@mui/material/Avatar";

type ResponseData = Course[];

const Courses = () => {
    const navigate = useNavigate();
    const { response, error, loading, sendRequest } = useAxiosRequest<
        Empty,
        ResponseData
    >();
    const [ course_data, setCourseData ] = useState()

    const alternatingColor = [
        "rgba(255, 255, 255, 0.5)",
        "rgba(255, 255, 255, 0.3)"
    ];

    useEffect(() => {
        sendRequest({
            method: "GET",
            route: "/course/getall/",
            useJWT: true
        });
    }, [sendRequest]);

    if (error) {
        console.error("Error fetching courses:", error);
        // Optionally, render an error message in the UI
    }

    const StyledTable = styled("table")({
        borderCollapse: "collapse",
        width: "100%",
        "& th, & td": {
            padding: "8px", // Adjust the padding as needed
            borderBottom: "1px solid #ddd", // Add a border bottom to create a divider effect
            textAlign: "left" // Align content to the left
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

    const handleNewCourseClick = () => {
        navigate(`/create_course`);
    };

    const handleCourseClick = (course_id: number) => {
        navigate(`/course/${course_id}/create_lecture`);
    };

    const handleEnrollment =
        (courseId: number, enroll: boolean) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (enroll) {
                backend_post("course/enroll/" + courseId, "", true);
                // if (response == null) return
                // const result = response.map((course : Course) => (course.id == courseId ? { ...course, enrolled: true } : course))
                // console.log(result)
            }
        };

    return (
        <RootPage>
            <Container component="main" className="mainComponent">
                <Typography variant="h4" gutterBottom>
                    Courses
                    {IsAdmin() ? (
                        <IconButton
                            onClick={() => handleNewCourseClick()}
                            style={{
                                marginLeft: "2%",
                                color: "white",
                                backgroundColor: "rgba(255, 255, 255, 0.5)"
                            }}
                        >
                            <AddCircleOutlineIcon style={{ fontSize: "1em" }} />
                        </IconButton>
                    ) : null}
                </Typography>

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th className="type-column">Students</th>
                            {IsAdmin() ? (
                                <th className="actions-column">Actions</th>
                            ) : 
                                <th className="actions-column">Enroll</th>
                                }
                        </tr>
                    </thead>
                    <tbody>
                        {response?.map((course: Course, index: number) => (
                            <tr
                                key={course.id}
                                style={{
                                    backgroundColor:
                                        alternatingColor[
                                            index % alternatingColor.length
                                        ]
                                }}
                            >
                                <td>
                                    <Button
                                        style={{
                                            color: "white",
                                            textTransform: "none",
                                            fontSize: "1em"
                                        }}
                                        onClick={() =>
                                            handleCourseClick(course.id)
                                        }
                                    >
                                        {`${course.course_name}`}
                                    </Button>
                                </td>
                                <td></td>
                                {IsAdmin() ? (
                                    <td className="actions-icon">
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td>
                                ) : 
                                <Checkbox
                                    checked={
                                        course.enrolled
                                    }
                                    onChange={handleEnrollment(
                                        course.id,
                                        !course.enrolled
                                    )}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            color: "white"
                                        }
                                    }}
                                />
                            }   
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            </Container>
        </RootPage>


    );
};

export default Courses;
