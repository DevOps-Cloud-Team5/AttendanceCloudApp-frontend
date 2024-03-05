import RootPage from "../root";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./people.css"; // Import CSS file for additional styling
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db } from "../../utils";
import { useNavigate } from "react-router-dom";

export default function People() {
    const navigate = useNavigate()
    const [allStudents, setAllStudents] = useState();
    const [allTeachers, setAllTeachers] = useState();

    const getStudents = async () => {
        const resp = await get_db("user/getrole/student", true)
        return resp.json()
    }

    const getTeachers = async () => {
        const resp = await get_db("user/getrole/teacher", true)
        return resp.json()
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getStudents(); 
                const teachers = await getTeachers(); 
                if ("code" in users || "code" in teachers) { // Not authenticated anymore
                    deleteAuthCookies()
                    navigate("/login")
                    navigate(0)
                    return
                }
                
                if (!("error" in users)) setAllStudents(users);
                if (!("error" in teachers)) setAllTeachers(teachers);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Show error on frontend
            }
        };

        fetchUsers();
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3C80D0', 
            },
            text: {
                primary: '#FAFAFA',
                secondary: 'rgba(255, 255, 255, 0.7)', // Change text color to white
            },
            background: {
                default: '#fff', // Change background color to black
            },
            secondary: {
                main: '#3C80D0',
              },
                mode:'dark',
            
        },
    })
    
    return (
        <RootPage>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    {allTeachers != undefined ? 
                        <List
                            sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
                            aria-label="Teachers"
                        >

                        <ListItem disablePadding>
                            <ListItemButton sx={{ border:1, bgcolor: 'rgba(255, 255, 255, 0.12)' }}>
                                <ListItemText primary="Teachers" />
                            </ListItemButton>
                        </ListItem>

                        {allTeachers.map(key => {
                            return (
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ border:1 }}>
                                        <ListItemText primary={key["first_name"] + " " + key["last_name"]} />
                                    </ListItemButton>
                                </ListItem>
                                )
                        })}
                        </List>
                    : null}

                    {allStudents != undefined ? 
                        <List
                            sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
                            aria-label="Students"
                        >

                        <ListItem disablePadding>
                            <ListItemButton sx={{ border:1, bgcolor: 'rgba(255, 255, 255, 0.12)' }}>
                                <ListItemText primary="Students" />
                            </ListItemButton>
                        </ListItem>

                        {allStudents.map(key => {
                            return (
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ border:1 }}>
                                        <ListItemText primary={key["first_name"] + " " + key["last_name"]} />
                                    </ListItemButton>
                                </ListItem>
                                )
                        })}
                        
                        </List>
                    : null}
                </Container>
            </ThemeProvider>
        </RootPage>
    );
}
