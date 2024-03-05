export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface Course {
    course_id: string;
    course_name: string;
    schedule: string[];
    enrolled_students: string[];
    teachers: string[]
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
