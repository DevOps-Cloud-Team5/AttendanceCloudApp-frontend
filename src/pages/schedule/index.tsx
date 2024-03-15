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
import { Button, Divider, capitalize } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "./schedule.css"; 

const AttendancePage: React.FC = () => {
    const navigate = useNavigate();
    const { response, error, loading, sendRequest } = useAxiosRequest<Empty, ScheduleLecture[]>();
    const [lectures, setLectures]  = useState<ScheduleLecture[][]>();
    const [schedule_date, setScheduleDate]  = useState<moment.Moment>( moment() );
    const alternatingColor = [
        "#424242",
        "#595959"
    ];


    const updateSchedule = () => {
        sendRequest({
            method: "GET",
            route: `/schedule/get/${schedule_date.year()}/${schedule_date.week()}`,
            useJWT: true
        });
    }

    useEffect(() => { updateSchedule() }, [sendRequest]);

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

    const convertToScheduleTime = (time : string) => {
        return moment(Date.parse(time)).format("HH:mm")
    }

    return (
        <RootPage>
            <Container
                component="main"
                maxWidth="md"
                sx={{ marginBottom: "5%" }}
                className="mainComponent"
            >
                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
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

                    <Divider style={{ marginBottom: "3%" }} />

                    {lectures?.map((day : ScheduleLecture[], dayIndex) => (
                        <div key={dayConvert[dayIndex]} style={{ background: alternatingColor[dayIndex%2], paddingTop: "0", marginTop: "0" }}>
                            <h2 style={{ paddingLeft: "2%", paddingTop: "1%", paddingBottom: "0", marginBottom: "0", marginTop: "0" }}>
                                {dayConvert[dayIndex]}
                            </h2>
                            
                            {(day.length != 0) ? <Divider variant="middle" style={{ marginTop: "1.5%" }} /> : null}

                            <List>
                                {day.map((lecture, lectureIndex) => (
                                    <ListItem key={lecture.id} style={{ marginTop: "-0.5%", marginBottom: "-1%" }}>
                                        <div style={{ marginRight: "3%" }}>
                                            <ListItemText primary={convertToScheduleTime(lecture.start_time)} />
                                            <ListItemText primary={convertToScheduleTime(lecture.end_time)} />
                                        </div>
                                        <ListItemText primary={lecture.course} secondary={capitalize(lecture.lecture_type)}/>

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
                                    ))
                                }
                            </List>
                        <Divider/>
                        </div>
                    ))}
                </div>
            </Container>
        </RootPage>
    );
};

export default AttendancePage;
