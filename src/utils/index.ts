import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";
import { CookieJWT, TokenResponse } from "../types/common";
import { jwtDecode } from "jwt-decode";

export const expire_time = 1800;

// export const backend_url = "https://bmjg67cbef.execute-api.eu-central-1.amazonaws.com/prod/"
export const backend_url = "http://127.0.0.1:8000/";

const apiURL = import.meta.env.VITE_API_URL;

interface UseAxiosRequestOptions<T> {
    method: Method;
    route: string;
    data?: T;
    headers?: { [key: string]: string };
    useJWT?: boolean;
}

export const useAxiosRequest = <TRequest, TResponse>() => {
    const [response, setResponse] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const combineUrl = (baseURL: string, route: string): string => {
        if (baseURL.endsWith("/")) {
            baseURL = baseURL.slice(0, -1);
        }
        return `${baseURL}${route.startsWith("/") ? "" : "/"}${route}`;
    };

    const sendRequest = useCallback(
        async (options: UseAxiosRequestOptions<TRequest>) => {
            setLoading(true);

            const config: AxiosRequestConfig<TRequest> = {
                method: options.method,
                url: combineUrl(apiURL, options.route),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    ...(options.useJWT && {
                        Authorization: `JWT ${Cookies.get("token_access")}`
                    }),
                    ...options.headers
                },
                ...(options.method !== "GET" && { data: options.data })
            };

            try {
                const result = await axios.request<TResponse>(config);
                setResponse(result.data);
            } catch (error) {
                let errorMessage: string = "An unknown error occurred"; // Default error message
                if (axios.isAxiosError(error)) {
                    // Now we can safely extract error information
                    if (
                        error.response &&
                        error.response.data &&
                        typeof error.response.data.message === "string"
                    ) {
                        // Use the error message from the response if available and is a string
                        errorMessage = error.response.data.message;
                    } else if (typeof error.message === "string") {
                        // Fallback to Axios error message
                        errorMessage = error.message;
                    }
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { response, error, loading, sendRequest, setResponse };
};
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

export const backend_get = (endpoint: string, useJWT: boolean = false) =>
    json_request(backend_url + endpoint, "GET", "", useJWT);

export const backend_delete = (endpoint: string, useJWT: boolean = false) =>
    json_request(backend_url + endpoint, "DELETE", "", useJWT);

export const backend_post = (
    endpoint: string,
    body_json: string = "",
    useJWT: boolean = false
) => json_request(backend_url + endpoint, "POST", body_json, useJWT);

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

    backend_post("token/refresh/", JSON.stringify({ refresh: refresh_token }))
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

export const IsStudent = () => {
    const jwt_token = getDecodedJWT();
    if ("code" in jwt_token) return false;
    return jwt_token["role"] == "student";
};

export const IsTeacher = () => {
    const jwt_token = getDecodedJWT();
    if ("code" in jwt_token) return false;
    return jwt_token["role"] == "teacher";
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
