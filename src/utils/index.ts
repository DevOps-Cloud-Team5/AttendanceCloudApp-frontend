import Cookies from "js-cookie";
import { CookieJWT, TokenResponse } from "../types/common";
import { jwtDecode } from "jwt-decode";

export const expire_time = 1800;

// export const db_url = "https://bmjg67cbef.execute-api.eu-central-1.amazonaws.com/prod/"
export const db_url = "http://127.0.0.1:8000/";

export const json_request = (
    url: string,
    method: string,
    body_json: string = "",
    useJWT: boolean = false
) => {
    if (useJWT) attemptTokenRefresh();

    const all_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...(useJWT && { Authorization: "JWT " + Cookies.get("token_access") }) // Only add authorization header if using JWT
    };

    const fetch_args = {
        method: method,
        headers: all_headers,
        ...(body_json.length !== 0 && {
            body: body_json
        }) // Only add body if it's not empty
    };

    return fetch(url, fetch_args);
};

export const get_db = (endpoint: string, useJWT: boolean = false) =>
    json_request(db_url + endpoint, "GET", "", useJWT);

export const post_db = (
    endpoint: string,
    body_json: string = "",
    useJWT: boolean = false
) => json_request(db_url + endpoint, "POST", body_json, useJWT);

export const isLoggedIn = () => {
    const spawn_time = Cookies.get("token_spawned");
    if (spawn_time == undefined) return false; // No active token

    const time_diff = Date.now() / 1000 - +spawn_time;
    return time_diff < expire_time;
};

export const deleteAuthCookies = () => {
    Cookies.remove("token_access");
    Cookies.remove("token_refresh");
    Cookies.remove("token_spawned");
};

const shouldRefreshToken = () => {
    const spawn_time = Cookies.get("token_spawned");
    if (spawn_time == undefined) return false; // No active token

    const time_diff = Date.now() / 1000 - +spawn_time;
    return time_diff > expire_time / 3; // Check if token is too fresh, will attempt a refresh after 1/3rd of the expire time
};

export const attemptTokenRefresh = () => {
    if (!shouldRefreshToken()) return;
    console.log("Refreshing access token");
    const refresh_token = Cookies.get("token_refresh");
    if (refresh_token == "undefined") return;

    const handleRefreshResponse = (data: TokenResponse) => {
        const expire_date = new Date(new Date().getTime() + expire_time * 1000);
        Cookies.set("token_access", data.access, { expires: expire_date });
        Cookies.set("token_refresh", data.refresh, { expires: expire_date });
        Cookies.set("token_spawned", (Date.now() / 1000).toString(), {
            expires: expire_date
        });
    };

    post_db("token/refresh/", refresh_token)
        .then((resp) => resp.json())
        .then((data) => handleRefreshResponse(data))
        .catch((error) => console.log(error));
};

export const getDecodedJWT = () => {
    const jwt_token = Cookies.get("token_access");
    if (jwt_token == undefined || jwt_token == "undefined")
        return { code: "missing access token" };
    const decoded: CookieJWT = jwtDecode(jwt_token);
    if (!("username" in decoded)) return { code: "broken access token" };
    return decoded;
};

export const IsAdmin = () => {
    const jwt_token = getDecodedJWT();
    if ("code" in jwt_token) return false;
    return jwt_token["role"] == "admin";
};

// getUrlDB()

// function getUrlDB() {
//     var url = "http://attendunce-redirect.s3-website.eu-central-1.amazonaws.com/test"
//     url = "http://bmjg67cbef.execute-api.eu-central-1.amazonaws.com/prod/test"

//     fetch(url, {
//         method: "GET",
//         redirect: 'follow',
//         headers: {
//             "Accept": "*/*",
//             "Access-Control-Allow-Origin": "*"
//         }
//     })
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
// }
