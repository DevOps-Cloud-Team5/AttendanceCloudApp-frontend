import RootPage from "../root";
import Container from "@mui/material/Container";
import "./courses.css"; // Import CSS file for additional styling
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";
import { useAxiosRequest } from "../../utils";
import { Course, Empty } from "../../types/common";

type ResponseData = Course[];

const Courses = () => {
    const { response, error, loading, sendRequest } = useAxiosRequest<
        Empty,
        ResponseData
    >();

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
    return (
        <RootPage>
            <Container component="main" maxWidth="xs">
                {loading ? (
                    <div>Loading...</div> // Added loading state feedback
                ) : (
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 1000
                        }}
                        aria-label="Courses"
                    >
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{
                                    border: 1,
                                    bgcolor: "rgba(255, 255, 255, 0.12)"
                                }}
                            >
                                <ListItemText primary="Courses" />
                            </ListItemButton>
                        </ListItem>

                        {response?.map((course: Course) => (
                            <ListItem disablePadding key={course.course_name}>
                                {" "}
                                {/* Assuming course_name is unique */}
                                <ListItemButton sx={{ border: 1 }}>
                                    <ListItemText
                                        primary={course.course_name}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Container>
        </RootPage>
    );
};

export default Courses;
