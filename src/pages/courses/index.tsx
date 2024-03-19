import RootPage from "../root";
import Container from "@mui/material/Container";
import "./courses.css"; // Import CSS file for additional styling
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_delete, useAxiosRequest } from "../../utils";
import { Course, Empty } from "../../types/common";
import { IsAdmin } from "../../utils";
import {
    Button,
    Checkbox,
    Icon,
    IconButton,
    Typography,
    styled
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type ResponseData = Course[];

const Courses = () => {
    const navigate = useNavigate();
    const { response, error, sendRequest } = useAxiosRequest<
        Empty,
        ResponseData
    >();
    const [course_data, setCourseData] = useState<Course[]>();

    const alternatingColor = ["#424242", "#595959"];

    useEffect(() => {
        sendRequest({
            method: "GET",
            route: "/course/getall/",
            useJWT: true
        });
    }, [sendRequest]);

    useEffect(() => {
        console.log(response);
        if (response) setCourseData(response);
    }, [response]);

    if (error) {
        console.error("Error fetching courses:", error);
        // Optionally, render an error message in the UI
    }

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
        "& .enroll-column": {
            width: "5%"
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
        navigate(`/course/${course_id}`);
    };

    const deleteCourse = (course_id: number) => {
        backend_delete("/course/delete/" + course_id, true).then((resp) => {
            if (resp.ok) {
                if (course_data == undefined) return;
                const tempCourses: Course[] = [...course_data];
                for (let i = 0; i < tempCourses.length; i++) {
                    if (tempCourses[i].id === course_id) {
                        tempCourses.splice(i, 1);
                        break;
                    }
                }
                setCourseData(tempCourses);
            }
        });
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
                            <th className="type-column">Teachers</th>
                            {IsAdmin() ? (
                                <th className="actions-column">Actions</th>
                            ) : (
                                <th className="enroll-column">Enrolled</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {course_data?.map((course: Course, index: number) => (
                            <tr
                                key={course.id}
                                style={{
                                    backgroundColor: alternatingColor[index % 2]
                                }}
                            >
                                <td>
                                    <Button
                                        style={{
                                            color: "white",
                                            textTransform: "none",
                                            fontSize: "1em"
                                        }}
                                        sx={{
                                            "&.MuiButtonBase-root:hover": {
                                                bgcolor: "transparent",
                                                textDecoration: "underline"
                                            }
                                        }}
                                        onClick={() =>
                                            handleCourseClick(course.id)
                                        }
                                    >
                                        {`${course.course_name}`}
                                    </Button>
                                </td>
                                <td>{course.num_students}</td>
                                <td>{course.num_teachers}</td>
                                {IsAdmin() ? (
                                    <td className="actions-icon">
                                        <IconButton
                                            onClick={() => {
                                                deleteCourse(course.id);
                                            }}
                                            sx={{
                                                "&.MuiButtonBase-root:hover": {
                                                    bgcolor: "transparent",
                                                    color: "red"
                                                }
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </td>
                                ) : (
                                    <Checkbox
                                        icon={<Icon />}
                                        checkedIcon={<CheckCircleIcon />}
                                        className="actions-icon"
                                        checked={course.enrolled}
                                        disabled={true}
                                        sx={{
                                            "& .MuiSvgIcon-root": {
                                                color: "white"
                                            }
                                        }}
                                    />
                                )}
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            </Container>
        </RootPage>
    );
};

export default Courses;
