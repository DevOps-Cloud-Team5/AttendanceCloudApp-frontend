import RootPage from "../root";
import Container from "@mui/material/Container";
import "./people.css"; // Import CSS file for additional styling
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db } from "../../utils";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/common";

const People = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState<User[]>();
    const [allTeachers, setAllTeachers] = useState<User[]>();

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

    return (
        <RootPage>
            <Container component="main" maxWidth="xs">
                {allTeachers != undefined ? (
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 1000,
                            bgcolor: "background.paper"
                        }}
                        aria-label="Teachers"
                    >
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{
                                    border: 1,
                                    bgcolor: "rgba(255, 255, 255, 0.12)"
                                }}
                            >
                                <ListItemText primary="Teachers" />
                            </ListItemButton>
                        </ListItem>
                        {allTeachers.map((key: User) => (
                            <ListItem disablePadding>
                                <ListItemButton sx={{ border: 1 }}>
                                    <ListItemText
                                        primary={
                                            key["first_name"] +
                                            " " +
                                            key["last_name"]
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : null}

                {allStudents != undefined ? (
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 1000,
                            bgcolor: "background.paper"
                        }}
                        aria-label="Students"
                    >
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{
                                    border: 1,
                                    bgcolor: "rgba(255, 255, 255, 0.12)"
                                }}
                            >
                                <ListItemText primary="Students" />
                            </ListItemButton>
                        </ListItem>

                        {allStudents.map((key: User) => (
                            <ListItem disablePadding>
                                <ListItemButton sx={{ border: 1 }}>
                                    <ListItemText
                                        primary={
                                            key["first_name"] +
                                            " " +
                                            key["last_name"]
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : null}
            </Container>
        </RootPage>
    );
};

export default People;
