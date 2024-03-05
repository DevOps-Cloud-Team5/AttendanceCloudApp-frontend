import Cookies from "js-cookie";
import { TokenResponse } from "../types/common";

export const expire_time = 1800;

// export const db_url = "https://bmjg67cbef.execute-api.eu-central-1.amazonaws.com/prod/"
export const db_url = "http://127.0.0.1:8000/";

export function post_json(url: string, body_json: string) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: body_json
    });
}

export function post_db(endpoint: string, body_json: string) {
    return post_json(db_url + endpoint, body_json);
}

function shouldRefreshToken() {
    const spawn_time = Cookies.get("token_spawned");
    if (spawn_time == undefined) return false; // No active token

    const time_diff = Date.now() / 1000 - +spawn_time;
    if (time_diff < expire_time / 3) return false; // Token is too fresh, will attempt a refresh after 1/3rd of the expire time
    return true;
}

export function attemptTokenRefresh() {
    if (!shouldRefreshToken()) return;
    console.log("Refreshing access token");
    const refresh_token = Cookies.get("token_refresh");
    if (typeof refresh_token == "undefined") return;

    const handleRefreshResponse = (data: TokenResponse) => {
        const expire_date = new Date(new Date().getTime() + expire_time * 1000);
        Cookies.set("token_access", data["access"], { expires: expire_date });
        Cookies.set("token_refresh", refresh_token, { expires: expire_date });
        Cookies.set("token_spawned", (Date.now() / 1000).toString(), {
            expires: expire_date
        });
    };

    post_db("token/refresh/", refresh_token)
        .then((resp) => resp.json())
        .then((data) => handleRefreshResponse(data))
        .catch((error) => console.log(error));
}

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
