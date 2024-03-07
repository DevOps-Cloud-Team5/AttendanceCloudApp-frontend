import RootPage from "../root";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./people.css"; // Import CSS file for additional styling
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db, IsAdmin } from "../../utils";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/common";
import { IconButton , Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';

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
                primary: "#333", // Changed text color to a darker shade
                secondary: "#666" // Changed secondary text color to a darker shade
            },
            background: {
                default: "#fff"
            },
            secondary: {
                main: "#3C80D0"
            },
            mode: "dark"
        }
    });

    const StyledTable = styled('table')({
        borderCollapse: 'collapse',
        width: '100%',
        '& th, & td': {
            padding: '8px', // Adjust the padding as needed
            borderBottom: '1px solid #ddd', // Add a border bottom to create a divider effect
            textAlign: 'left', // Align content to the left
        },
        '& th': {
            // backgroundColor: '#f2f2f2', // Add background color to header cells if needed
            fontWeight: 'bold', // Add bold font weight to header cells if needed
        },
        '& .type-column': {
            width: '10%', // Adjust the width of the actions column
            textAlign: 'left', // Align content to the left
        },
        '& .actions-column': {
            width: '5%', // Adjust the width of the actions column
            textAlign: 'left', // Align content to the left
        },
        '& .avatar-column': {
            width: '5%', // Adjust the width of the avatar column
            textAlign: 'left', // Align content to the left
        },
        '& .actions-icon': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    

    return (
        <RootPage>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <Typography variant="h4" gutterBottom>
                        People
                    </Typography>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th className="avatar-column"></th>
                                <th>Name</th>
                                <th className="type-column">Role</th>
                                {IsAdmin() ? <th className="actions-column">Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {allTeachers?.map((teacher: User, index: number) => (
                                <tr key={teacher.id} style={{ backgroundColor: alternatingColor[index % alternatingColor.length] }}>
                                    <td className="avatar-column">
                                        <Avatar alt={`${teacher.first_name} ${teacher.last_name}`} src={teacher.avatarUrl} />
                                    </td>
                                    <td>{`${teacher.first_name} ${teacher.last_name}`}</td>
                                    <td>Teacher</td>
                                    {IsAdmin() ? <td className="actions-icon">
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td> : null}
                                </tr>
                            ))}
                            {allStudents?.map((student: User, index: number) => (
                                <tr key={student.id} style={{ backgroundColor: alternatingColor[index % alternatingColor.length] }}>
                                    <td className="avatar-column">
                                        <Avatar alt={`${student.first_name} ${student.last_name}`} src={student.avatarUrl} />
                                    </td>
                                    <td>{`${student.first_name} ${student.last_name}`}</td>
                                    <td>Student</td>
                                    {IsAdmin() ? <td className="actions-icon">
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td> : null}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </Container>
            </ThemeProvider>
        </RootPage>
    );
};

export default People;
