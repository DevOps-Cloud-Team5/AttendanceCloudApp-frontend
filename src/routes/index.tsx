import React, { FC } from "react"; import { Route, Switch } from "react-router-dom";

// import LoginPage from "../pages/login";
import HomePage from "../pages/home/home";


const AppRoutes: FC = () => {
    return (
        <Switch>
            {/* <Route path="/login" component={LoginPage} /> */}
            <Route path="/" exact={true} component={HomePage} />
        </Switch>
    );
}
export default AppRoutes;