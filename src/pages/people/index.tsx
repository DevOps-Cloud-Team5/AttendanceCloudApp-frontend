import RootPage from "../root";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./people.css"; // Import CSS file for additional styling
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db } from "../../utils";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/common";
import { ListItemSecondaryAction, Typography } from '@mui/material';

const People = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState<User[]>();
    const [allTeachers, setAllTeachers] = useState<User[]>();
    const alternatingColor = ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)'];

    const getStudents = async () => {
        const resp = await get_db("user/getrole/student", true);
        return resp.json();
    };

    const getTeachers = async () => {
        const resp = await get_db("user/getrole/teacher", true);
        return resp.json();
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getStudents();
                const teachers = await getTeachers();
                if ("code" in users || "code" in teachers) {
                    // Not authenticated anymore
                    deleteAuthCookies();
                    navigate("/login");
                    navigate(0);
                    return;
                }

                if (!("error" in users || "detail" in users))
                    setAllStudents(users);
                if (!("error" in teachers || "detail" in teachers))
                    setAllTeachers(teachers);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Show error on frontend
            }
        };

        fetchUsers();
    }, [navigate]);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#3C80D0"
            },
            text: {
                primary: "#FAFAFA",
                secondary: "rgba(255, 255, 255, 0.7)" // Change text color to white
            },
            background: {
                default: "#fff" // Change background color to black
            },
            secondary: {
                main: "#3C80D0"
            },
            mode: "dark"
        }
    });

    return (
<RootPage>
    <ThemeProvider theme={theme}>
        <Container component="main">
            <Typography variant="h5" gutterBottom>
                People
            </Typography>
            <List
                sx={{
                    width: "100%",
                    maxWidth: "none",
                    marginLeft: "auto",
                    bgcolor: "background.paper"
                }}
                aria-label="People"
            >
                {allTeachers != undefined ? (
                    allTeachers.map((teacher: User, index: number) => (
                        <ListItem disablePadding key={teacher.id}>
                            <ListItemButton
                                sx={{
                                    borderTop: 1,
                                    borderBottom: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.12)',
                                    bgcolor: alternatingColor[index % alternatingColor.length]
                                }}
                            >
                                <ListItemText
                                    primary={`${teacher.first_name} ${teacher.last_name}`}
                                />
                                <ListItemSecondaryAction>
                                    <Typography variant="body2" color="textSecondary">
                                        Teacher
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : null}
                {allStudents != undefined ? (
                    allStudents.map((student: User, index: number) => (
                        <ListItem disablePadding key={student.id}>
                            <ListItemButton
                                sx={{
                                    borderTop: 1,
                                    borderBottom: 1,
                                    bgcolor: alternatingColor[index % alternatingColor.length]
                                }}
                            >
                                <ListItemText
                                    primary={`${student.first_name} ${student.last_name}`}
                                />
                                <ListItemSecondaryAction>
                                    <Typography variant="body2" color="textSecondary">
                                        Student
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : null}
            </List>
        </Container>
    </ThemeProvider>
</RootPage>


    
    );
};

export default People;
