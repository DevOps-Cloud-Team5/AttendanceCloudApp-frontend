export interface Empty {}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface Course {
    id: number;
    course_name: string;
    enrolled: boolean;
    num_students: number;
    num_teachers: number;
}

export interface FullCourseUser {
    username: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface FullCourse {
    id: number;
    course_name: string;
    num_teachers: number;
    num_students: number;
    enrolled: boolean;
    attended: number;
    missed: number;
    users: FullCourseUser[];
}

export interface AttendenceStats {
    attended: string;
    missed: string;
}

export interface ScheduleLecture {
    id: number;
    start_time: string;
    end_time: string;
    lecture_type: string;
    course_name: string;
    course: number;
    attended_student: boolean | null;
    attended_teacher: boolean | null;
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

export interface UserCSV {
    first_name: string;
    last_name: string;
    password: string | null;
    username: string | null;
    email: string | null;
    role: string | null;
}

export interface CookieJWT {
    username: string;
    email: string;
    role: string;
}

export interface ConfirmUserCSV {
    name: string;
    success: boolean;
}

export interface FullLectureUser {
    first_name: string;
    last_name: string;
    username: string;
    attended: boolean;
}

export interface FullLecture {
    id: number;
    start_time: string;
    end_time: string;
    lecture_type: string;
    course: number;
    course_name: string;
    students: FullLectureUser[];
}
