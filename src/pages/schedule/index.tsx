import RootPage from "../root";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";
import { Course, AttendanceData } from "../../types/common";

// Mock data for courses
const mockCourses: Course[] = [
    {
        course_id: "course1",
        course_name: "Mathematics",
        schedule: ["Monday", "Wednesday", "Friday"],
        enrolled_students: ["student1", "student2", "student3"],
        teachers: ["teacher1", "teacher2"]
    },
    {
        course_id: "course2",
        course_name: "Physics",
        schedule: ["Tuesday", "Thursday"],
        enrolled_students: ["student2", "student3", "student4"],
        teachers: ["teacher2", "teacher3"]
    },
    {
        course_id: "course3",
        course_name: "Biology",
        schedule: ["Monday", "Wednesday"],
        enrolled_students: ["student1", "student3", "student4"],
        teachers: ["teacher1", "teacher3"]
    }
];

const initialAttendanceData: AttendanceData = {};

// Initialize attendance data for each course and each day
mockCourses.forEach((course) => {
    course.schedule.forEach((day) => {
        initialAttendanceData[day] = initialAttendanceData[day] || {};
        initialAttendanceData[day][course.course_id] = false;
    });
});

const AttendancePage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const [attendance, setAttendance] = useState<AttendanceData>(
        initialAttendanceData
    );

    const handleAttendanceChange =
        (courseId: string, day: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setAttendance((prevAttendance) => ({
                ...prevAttendance,
                [day]: {
                    ...prevAttendance[day],
                    [courseId]: event.target.checked
                }
            }));
            // You can send the updated attendance for the specific course and day to the backend here
        };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return (
        <RootPage>
            <Container
                component="main"
                maxWidth="xs"
                sx={{ marginBottom: "5%" }}
            >
                <h1>Attendance</h1>
                {daysOfWeek.map((day) => (
                    <div key={day}>
                        <h2>{day}</h2>
                        <List>
                            {mockCourses
                                .filter((course) =>
                                    course.schedule.includes(day)
                                )
                                .map((course) => (
                                    <ListItem key={course.course_id}>
                                        <ListItemText
                                            primary={course.course_name}
                                        />
                                        <Checkbox
                                            checked={
                                                attendance[day][
                                                    course.course_id
                                                ] || false
                                            }
                                            onChange={handleAttendanceChange(
                                                course.course_id,
                                                day
                                            )}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    // Overrides the color of the checkbox icon
                                                    color: "white"
                                                }
                                            }}
                                        />
                                          <Checkbox
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    // Overrides the color of the checkbox icon
                                                    color: "white"
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </div>
                ))}
            </Container>
        </RootPage>
    );
};

export default AttendancePage;
