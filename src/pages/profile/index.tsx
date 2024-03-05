import React, { FC, useState, useEffect } from "react";
import RootPage from "../root";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { CircularProgress } from "@mui/material";
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./login.css"; // Import CSS file for additional styling
import { Box, FormControlLabel } from "@mui/material";
import { get_db, expire_time, deleteAuthCookies } from "../../utils";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

function Profile() {
    const navigate = useNavigate()
    
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        role: '',
        first_name: '',
        last_name: '',
        avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    });

    const getProfileData = async () => {
        const jwt_token = Cookies.get("token_access")
        const decoded = jwtDecode(jwt_token)
        const username = decoded["username"]
        const resp = await get_db("user/get/" + username, true)
        return resp.json()
    }

    const getRandomPicture = () => {
        const img_index = Math.floor(Math.random() * 100);
        return "https://randomuser.me/api/portraits/men/" + img_index + ".jpg";
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getProfileData(); // Assuming getUserProfile returns user profile data
                if ("code" in profile) {
                    deleteAuthCookies()
                    navigate("/login")
                    navigate(0)
                    return
                }
                profile[0]["avaterUrl"] = getRandomPicture();
                setProfileData(profile[0]);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Show error on frontend
            }
        };

        fetchUserProfile();
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
                mode:'light',
            
        },
    })

    return (
    <RootPage>
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div className="profile">
                    <img className="avatar" src={profileData.avatarUrl} alt="User Avatar" />
                    <div className="profile-info">
                        <Typography component="h1" variant="h5">
                            {profileData.first_name} {profileData.last_name}
                        </Typography>
                        <Typography component="p" variant="body1">
                            Username: {profileData.username}
                        </Typography>
                        <Typography component="p" variant="body1">
                            Email: {profileData.email}
                        </Typography>
                        <Typography component="p" variant="body1">
                            Role: {profileData.role}
                        </Typography>
                    </div>
                </div>
            </Container>
        </ThemeProvider>
    </RootPage>
    );
}

export default Profile;
