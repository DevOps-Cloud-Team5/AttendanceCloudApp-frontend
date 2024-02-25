import React, { FC, useState } from "react";
import RootPage from "../root";
import "./login.css"; // Import CSS file for styling

const LoginPage: FC = () => {
    const [rememberMe, setRememberMe] = useState(false);

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
        // put registration link?
    };

    const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted");
        // send api request?
    };

    return (
        <RootPage>
            <div className="login-container">
                <h1 className="login-title">Account Login</h1>
                <form className="login-form" onSubmit={handleLoginFormSubmit}>
                    <input type="text" placeholder="Username" required /><br />
                    <input type="password" placeholder="Password" required /><br />
                    <label className="remember">
                        <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                        Remember Me
                    </label><br />
                    <a className="forget" href="#" onClick={handleForgotPassword}>Forgot Password?</a><br />
                    <button type="submit">Login</button>
                </form>
            </div>
        </RootPage>
    );
};

export default LoginPage;
