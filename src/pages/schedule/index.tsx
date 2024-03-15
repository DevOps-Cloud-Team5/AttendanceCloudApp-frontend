import RootPage from "../root";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { ScheduleLecture, AttendanceData, Empty } from "../../types/common";
import { backend_post, useAxiosRequest } from "../../utils";
import moment from "moment";
import { Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AttendancePage: React.FC = () => {
    const navigate = useNavigate();
    const { response, error, loading, sendRequest } = useAxiosRequest<Empty, ScheduleLecture[]>();
    const [lectures, setLectures]  = useState<ScheduleLecture[][]>();
    const [schedule_date, setScheduleDate]  = useState<moment.Moment>( moment() );

    const updateSchedule = () => {
        sendRequest({
            method: "GET",
            route: `/schedule/get/${schedule_date.year()}/${schedule_date.week()}`,
            useJWT: true
        });
    }

    useEffect(() => {
        updateSchedule()
    }, [sendRequest]);

    useEffect(() => {
        if (response) {
            let all_lectures : ScheduleLecture[][] = Array(7).fill([]);
            for (const lec of response) {
                const day = new Date(Date.parse(lec["start_time"])).getDay()
                all_lectures[day] = all_lectures[day].concat([lec])
            }
            setLectures(all_lectures)
        }
    }, [response]);

    const setStudentAttendence = (lecture_id : number) => {
        const new_lectures = lectures?.map(
            (lectures : ScheduleLecture[]) => 
                lectures.map(
                    (lecture : ScheduleLecture) => (lecture.id == lecture_id ? { ...lecture, attended_student: true } : lecture))
                )
        setLectures(new_lectures)
    }

    const handleAttendanceChange =
        (lecture_id: number) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            backend_post(`lecture/${lecture_id}/student_att`, "", true)
            .then((resp) => { 
                    if (resp.status == 200) setStudentAttendence(lecture_id)
                }
            )
            .catch((error) => console.log(error));
        };


    function goBackWeek() {
        setScheduleDate(schedule_date.subtract(7, "days"))
        updateSchedule()
    }

    function goForwardWeek() {
        setScheduleDate(schedule_date.add(7, "days"))
        updateSchedule()
    }

    const dayConvert = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const monthConvert = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobor", "November", "December"]

    return (
        <RootPage>
            <Container
                component="main"
                maxWidth="xs"
                sx={{ marginBottom: "5%" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                        <h2>{`Week ${schedule_date.week()} overview`}</h2> 
                        <h3>{`${monthConvert[schedule_date.month()]} ${schedule_date.year()}`}</h3>
                    </div>
                    <div>
                        <Button variant="contained" style={{ minWidth: "1em", width: "auto", height: "2.5em" }} onClick={goBackWeek}>
                            <ArrowBackIcon />
                        </Button>
                        <Button variant="contained" style={{ minWidth: "1em", width: "auto", height: "2.5em" }} onClick={goForwardWeek}>
                            <ArrowForwardIcon />
                        </Button>
                    </div>
                </div>

                {lectures?.map((day, index) => (
                    <div key={dayConvert[index]}>
                        <h2>{dayConvert[index]}</h2>
                        <List>
                            {day.map((lecture) => (
                                <ListItem key={lecture.id}>
                                    <ListItemText primary={lecture.course} />
                                    <Checkbox
                                        checked={lecture.attended_student}
                                        onChange={handleAttendanceChange(lecture.id)}
                                        sx={{ "& .MuiSvgIcon-root": { color: "white" } }}
                                    />
                                    <Checkbox
                                        checked={lecture.attended_teacher}
                                        disabled={true}
                                        sx={{ "& .MuiSvgIcon-root": { color: "white" } }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                ))}
            </Container>
        </RootPage>
    );
};

export default AttendancePage;
