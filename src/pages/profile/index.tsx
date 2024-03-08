import { useState, useEffect } from "react";
import RootPage from "../root";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import "./profile.css"; // Import CSS file for additional styling
import { get_db, deleteAuthCookies } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
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
        avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg"
    });

    const getProfileData = async () => {
        let username = ""
        if (id != undefined) username = id
        else {
            const jwt_token = Cookies.get("token_access");
            if (jwt_token == undefined) return { code: "missing access token" };
            const decoded: CookieJWT = jwtDecode(jwt_token);
            if (!("username" in decoded)) return { code: "broken access token" };
            username = decoded["username"];
        }
        const resp = await get_db("user/get/" + username, true);
        return resp.json();
    };

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
                profile[0]["avaterUrl"] = "https://randomuser.me/api/portraits/men/5.jpg"
                setProfileData(profile[0]);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Show error on frontend
            }
        };

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
        </RootPage>
    );
};

export default Profile;
