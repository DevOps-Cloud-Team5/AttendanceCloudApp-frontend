import { deleteAuthCookies, useAxiosRequest } from "../../utils";
import { Empty } from "../../types/common";

import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import { isLoggedIn } from "../../utils";

import "./navbar.css";

const Navbar = () => {
    const { sendRequest } = useAxiosRequest<Empty, Empty>();
    const navigate = useNavigate();

    const handleLogout = () => {
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
    };

    return (
        <header className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="navbar-right">
                {isLoggedIn() ? (
                    <>
                        <Link to="/schedule" className="text-primary">
                            Schedule
                        </Link>
                        <Link to="/people" className="text-primary">
                            People
                        </Link>
                        <Link to="/courses" className="text-primary">
                            Courses
                        </Link>
                        <Link to="/profile" className="text-primary">
                            Profile
                        </Link>
                        <a onClick={handleLogout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-primary">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
