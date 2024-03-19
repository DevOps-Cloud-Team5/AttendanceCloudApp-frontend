import { useState, useEffect } from "react";
import RootPage from "../root";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import "./profile.css"; // Import CSS file for additional styling
import { get_db, deleteAuthCookies } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CookieJWT } from "../../types/common";

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        role: "",
        first_name: "",
        last_name: "",
        avatarUrl: ""
    });

    const getProfileData = async () => {
        let username = "";
        if (id != undefined) username = id;
        else {
            const jwt_token = Cookies.get("token_access");
            if (jwt_token == undefined) return { code: "missing access token" };
            const decoded: CookieJWT = jwtDecode(jwt_token);
            if (!("username" in decoded))
                return { code: "broken access token" };
            username = decoded["username"];
        }
        const resp = await get_db("user/get/" + username, true);
        return resp.json();
    };
    
    const updateProfilePicture = async () => {
        
        console.log('Update Profile Picture function triggered');
    };

    // const [loggedInUsername, setLoggedInUsername] = useState("");
    //store image inside a storage solution (S3 bucket)!
    // After, we collect the url from the s3
    // store url in database
    // it will be retrieved in getprofile data via url
    // 1 image per profile, therefore, override the previous one
    //https://www.youtube.com/watch?v=yGYeYJpRWPM
    

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getProfileData(); // Assuming getUserProfile returns user profile data
                if ("code" in profile) {
                    deleteAuthCookies();
                    navigate("/login");
                    navigate(0);
                    return;
                }
                // if profile[0]
                profile[0]["avatarUrl"] =
                    "https://randomuser.me/api/portraits/men/5.jpg";
                setProfileData(profile[0]);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Show error on frontend
            }
        };

        // const jwt_token = Cookies.get("token_access");
        // if (jwt_token) {
        //     const decodedToken = jwtDecode(jwt_token);
        //     if (decodedToken && "username" in decodedToken) {
        //         setLoggedInUsername(decodedToken.username);
        //     }
        // }

        fetchUserProfile();
    }, [navigate]);

    return (
        <RootPage>
            <Container component="main" maxWidth="xs">
                <div className="profile">
                    <img
                        className="avatar"
                        src={profileData.avatarUrl}
                        alt="User Avatar"
                    />
                    <button className="update-btn" onClick={updateProfilePicture}>
                        Update Profile Picture
                     </button>
                    <div className="profile-info">
                        <Typography component="h1" variant="h5">
                            {profileData.first_name} {profileData.last_name}
                        </Typography>
                        <p><span className="label">Username:</span> {profileData.username}</p>
                        <p><span className="label">Email:</span> {profileData.email}</p>
                        <p><span className="label">Role:</span> {profileData.role}</p>
                    </div>
                    
                </div>
            </Container>
        </RootPage>
    );
};

export default Profile;
