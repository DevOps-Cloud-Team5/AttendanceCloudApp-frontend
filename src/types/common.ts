export interface Empty {}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface Course {
    id: number;
    course_name: string;
}

export interface User {
    id: number;
    password: string;
    last_login: null;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    courses: [];
    role: string;
}

export interface CookieJWT {
    username: string;
    email: string;
    role: string;
}
