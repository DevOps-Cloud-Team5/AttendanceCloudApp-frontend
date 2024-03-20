import { useState, useEffect, useCallback } from "react";
import RootPage from "../root";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import "./profile.css"; // Import CSS file for additional styling

import { backend_get, deleteAuthCookies, useAxiosRequest } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CookieJWT } from "../../types/common";
import { Button, capitalize } from "@mui/material";


//TODO:
// 1. Apply the support for uploading and storing the images via S3.
/**
 * The idea is 
 * store image inside a storage solution (S3 bucket)!
 * After, we collect the url from the s3
 * store url in database
 * it will be retrieved in getprofile data via url
 * 1 image per profile, therefore, override the previous one
 * 
 * How to send an image to S3 bucket?
 * Frontend -> Backend -> S3 Bucket
 * url from S3 Bucket -> database -> fetch it via 
 * Cloud formation should be in backend.
 * 
 */

const Profile = () => {
    const { sendRequest } = useAxiosRequest<Empty, Empty>();
    const navigate = useNavigate();
    const { id } = useParams();

    const [flag, setFlag] = useState(false);
    const randomNumber = Math.random();

    // const [gender, getGender] = useState(false)
    const generateRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var gender = "";
    
    if (generateRandomInteger(1,2) == 1) {
        gender = "men";
    }
    else{
        gender = "women";
    }


    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        role: "",
        first_name: "",
        last_name: "",
        avatarUrl: ""
    });

    const getProfileData = useCallback(async () => {
        let username = "";
        if (id != undefined){ username = id; setFlag(false); }
        else {
            setFlag(true);
            const jwt_token = Cookies.get("token_access");
            if (jwt_token == undefined) return { code: "missing access token" };
            const decoded: CookieJWT = jwtDecode(jwt_token);
            // console.log("Here we have decoded: "+ decoded["username"]);
            if (!("username" in decoded))
                return { code: "broken access token" };
            username = decoded["username"];
        }

        console.log("We're close " + id)

        const resp = await backend_get("user/get/" + username, true);
        // console.log("What is this" + resp.json())
        return resp.json();
    }, [id]);

    const functionLogout = () => {
        sendRequest({
            method: "POST",
            route: "/token/blacklist/",
            useJWT: true
        })
            .then(() => {
                deleteAuthCookies();
                navigate("/login");
                navigate(0);
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }
    // const [loggedInUsername, setLoggedInUsername] = useState("");
    
    const updateProfilePicture = async () => {
        console.log('Update Profile Picture function triggered');
    };


    const updatePassword = async () => {
        // const profile = await getProfileData(); 
        console.log("HAHAH")
        navigate("/reset_password_request");
        navigate(0);
        return;
    };

    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getProfileData(); // Assuming getUserProfile returns user profile data
                console.log("hahaha " + profile["username"])
                if ("code" in profile) {
                    deleteAuthCookies();
                    navigate("/login");
                    navigate(0);
                    return;
                }
                profile["avatarUrl"] =
                    "https://randomuser.me/api/portraits/"+ gender +"/" + generateRandomInteger(1,99).toString() + ".jpg";
                setProfileData(profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Show error on frontend
            }
        };

        fetchUserProfile();
    }, [getProfileData, navigate]);

    return (
        <RootPage>
            {flag && (
            <div>
            <span className="prof">Personal Profile Page</span>
            </div>
            )}
            <Container component="main" maxWidth="xs">
                <div className="profile">
                    <img
                        className="avatar"
                        src={profileData.avatarUrl}
                        alt="User Avatar"
                    />

                    <div className="profile-info">
                        <Typography component="h1" variant="h5">
                            {profileData.first_name} {profileData.last_name}
                        </Typography>
                        <p>
                            <span className="label">Username:</span>
                            {profileData.username}
                        </p>
                        <p>
                            <span className="label">Email:</span>
                            {profileData.email}
                        </p>
                        <p>
                            <span className="label">Role:</span>
                            {capitalize(profileData.role)}
                        </p>
                    </div>

                    {flag && (
                    <div style={{ marginTop: "3%" }}>
                        <Button
                            variant="contained"
                            sx={{ textTransform: "none" }}
                            onClick = {updateProfilePicture}
                        >
                            Change Picture
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ textTransform: "none" }}
                            onClick = {updatePassword}
                        >
                            Change Password
                        </Button>
                    </div>
                    )}
                    {flag && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: "3%", textTransform: "none" }}
                        onClick = {functionLogout}
                    >
                        Log Out
                    </Button>
                    )}
                        
                </div>
            </Container>
        </RootPage>
    );
};

export default Profile;
