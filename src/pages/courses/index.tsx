import RootPage from "../root";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./courses.css"; // Import CSS file for additional styling
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db } from "../../utils";
import { useNavigate } from "react-router-dom";

export default function Courses() {
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState();

    const getCourses = async () => {
        const resp = await get_db("course/getall/", true)
        return resp.json()
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getCourses(); 
                if ("code" in courses) { // Not authenticated anymore
                    deleteAuthCookies()
                    navigate("/login")
                    navigate(0)
                    return
                }
                
                if (!("error" in courses)) setAllCourses(courses);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Show error on frontend
            }
        };

        fetchCourses();
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
                    {allCourses != undefined ? 
                        <List
                            sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
                            aria-label="Courses"
                        >

                        <ListItem disablePadding>
                            <ListItemButton sx={{ border:1, bgcolor: 'rgba(255, 255, 255, 0.12)' }}>
                                <ListItemText primary="Courses" />
                            </ListItemButton>
                        </ListItem>

                        {allCourses.map(key => {
                            return (
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ border:1 }}>
                                        <ListItemText primary={key["course_name"]} />
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
