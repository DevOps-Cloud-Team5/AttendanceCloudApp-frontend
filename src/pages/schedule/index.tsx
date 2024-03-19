import RootPage from "../root";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { ScheduleLecture, Empty } from "../../types/common";
import {
    IsStudent,
    backend_delete,
    backend_post,
    useAxiosRequest
} from "../../utils";
import moment from "moment";
import {
    Button,
    Divider,
    IconButton,
    Tooltip,
    capitalize
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import "./schedule.css";

// Set monday to the first day of the week
moment.updateLocale("en", { week: { dow: 1 } });

const AttendancePage: React.FC = () => {
    const navigate = useNavigate();
    const { response, error, loading, sendRequest } = useAxiosRequest<
        Empty,
        ScheduleLecture[]
    >();
    const [lectures, setLectures] = useState<ScheduleLecture[][]>();
    const [schedule_date, setScheduleDate] = useState<moment.Moment>(moment());
    const alternatingColor = ["#424242", "#595959"];
    const { id } = useParams();

    const updateSchedule = () => {
        let url = `/schedule/get/${schedule_date.year()}/${schedule_date.week()}`;
        if (id != undefined) url += "/" + id;
        sendRequest({
            method: "GET",
            route: url,
            useJWT: true
        });
    };

    useEffect(() => {
        updateSchedule();
    }, [sendRequest]);

    useEffect(() => {
        if (response) {
            let all_lectures: ScheduleLecture[][] = Array(7).fill([]);
            for (const lec of response) {
                if (id != undefined && lec["course"] != +id) continue;
                const day = new Date(Date.parse(lec["start_time"])).getDay();
                all_lectures[day] = all_lectures[day].concat([lec]);
            }
            setLectures(all_lectures);
        }
    }, [response]);

    const setStudentAttendence = (lecture_id: number, attended: boolean) => {
        const new_lectures = lectures?.map((lectures: ScheduleLecture[]) =>
            lectures.map((lecture: ScheduleLecture) =>
                lecture.id == lecture_id
                    ? { ...lecture, attended_student: attended }
                    : lecture
            )
        );
        setLectures(new_lectures);
    };

    const handleAttendanceChange = (lecture: ScheduleLecture) => {
        let url = `lecture/${lecture.id}/student_set_att`;
        let attended = true;

        if (lecture.attended_student == true) {
            url = `lecture/${lecture.id}/student_unset_att`;
            attended = false;
        }

        backend_post(url, "", true)
            .then((resp) => {
                if (resp.status == 200)
                    setStudentAttendence(lecture.id, attended);
            })
            .catch((error) => console.log(error));
    };

    const goBackWeek = () => {
        setScheduleDate(schedule_date.subtract(7, "days"));
        updateSchedule();
    };

    const goForwardWeek = () => {
        setScheduleDate(schedule_date.add(7, "days"));
        updateSchedule();
    };

    const dayConvert = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    const monthConvert = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "Octobor",
        "November",
        "December"
    ];

    const convertToScheduleTime = (time: string) => {
        return moment(Date.parse(time)).format("HH:mm");
    };

    const getCheckboxColor = (
        lecture: ScheduleLecture,
        attended_box: boolean | null
    ) => {
        if (lecture.attended_student && lecture.attended_teacher)
            return "green";
        if (attended_box == false) return "rgb(224, 6, 31)";
        return "white";
    };

    // Get date of a specific weekday in the current week
    const getDateDay = (dayIndex: number) => {
        const new_date = schedule_date.weekday(dayIndex);
        return new_date.date();
    };

    const getCourseName = () => {
        if (lectures == undefined) return "";
        for (const day of lectures)
            for (const lec of day) return `| ${lec.course_name}`;
        return "";
    };

    const deleteLecture = (lecture_id: number) => {
        backend_delete(`course/lecture/${lecture_id}/delete`, true).then(
            (resp) => {
                if (resp.ok) {
                    const new_lectures = lectures?.map(
                        (lectureGroup: ScheduleLecture[]) =>
                            lectureGroup.filter(
                                (lecture: ScheduleLecture) =>
                                    lecture.id !== lecture_id
                            )
                    );
                    setLectures(new_lectures);
                }
            }
        );
    };

    return (
        <RootPage>
            <Container
                component="main"
                maxWidth="md"
                sx={{ marginBottom: "5%" }}
                className="mainComponent"
            >
                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px"
                        }}
                    >
                        <div>
                            <h2>
                                {`Week ${schedule_date.week()} overview`}{" "}
                                {id != undefined ? getCourseName() : ""}
                            </h2>
                            <h3>{`${monthConvert[schedule_date.month()]} ${schedule_date.year()}`}</h3>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                style={{
                                    minWidth: "1em",
                                    width: "auto",
                                    height: "2.5em"
                                }}
                                onClick={goBackWeek}
                            >
                                <ArrowBackIcon />
                            </Button>
                            <Button
                                variant="contained"
                                style={{
                                    minWidth: "1em",
                                    width: "auto",
                                    height: "2.5em"
                                }}
                                onClick={goForwardWeek}
                            >
                                <ArrowForwardIcon />
                            </Button>
                        </div>
                    </div>

                    <Divider style={{ marginBottom: "3%" }} />

                    {lectures?.map((day: ScheduleLecture[], dayIndex) => (
                        <div
                            key={dayConvert[dayIndex]}
                            style={{
                                background: alternatingColor[dayIndex % 2],
                                paddingTop: "0",
                                marginTop: "0"
                            }}
                        >
                            <h2
                                style={{
                                    paddingLeft: "2%",
                                    paddingTop: "1%",
                                    paddingBottom: "0",
                                    marginBottom: "0",
                                    marginTop: "0"
                                }}
                            >
                                {`${getDateDay(dayIndex)} ${dayConvert[dayIndex]}`}
                            </h2>

                            {day.length != 0 ? (
                                <Divider
                                    variant="middle"
                                    style={{ marginTop: "1.5%" }}
                                />
                            ) : null}

                            <List>
                                {day.map((lecture) => (
                                    <ListItem
                                        key={lecture.id}
                                        style={{
                                            marginTop: "-0.5%",
                                            marginBottom: "-1%"
                                        }}
                                    >
                                        <div style={{ marginRight: "1%" }}>
                                            <ListItemText
                                                primary={convertToScheduleTime(
                                                    lecture.start_time
                                                )}
                                            />
                                            <ListItemText
                                                primary={convertToScheduleTime(
                                                    lecture.end_time
                                                )}
                                            />
                                        </div>
                                        <Button
                                            variant="string"
                                            color="inherit"
                                            disableTouchRipple
                                            onClick={() =>
                                                navigate(
                                                    `/course/${lecture.course}`
                                                )
                                            }
                                            sx={{
                                                textTransform: "none",
                                                textAlign: "left",
                                                "&.MuiButtonBase-root:hover": {
                                                    bgcolor: "transparent",
                                                    textDecoration: "underline"
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={lecture.course_name}
                                                secondary={capitalize(
                                                    lecture.lecture_type
                                                )}
                                            />
                                        </Button>

                                        <ListItemText primary={""} />
                                        {IsStudent() ? (
                                            <>
                                                <Checkbox
                                                    indeterminateIcon={
                                                        <CheckBoxOutlineBlankIcon />
                                                    }
                                                    icon={
                                                        <IndeterminateCheckBoxIcon />
                                                    }
                                                    indeterminate={
                                                        lecture.attended_student ==
                                                        null
                                                    }
                                                    checked={
                                                        lecture.attended_student ==
                                                        true
                                                    }
                                                    onChange={() =>
                                                        handleAttendanceChange(
                                                            lecture
                                                        )
                                                    }
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            color: getCheckboxColor(
                                                                lecture,
                                                                lecture.attended_student
                                                            )
                                                        }
                                                    }}
                                                />
                                                <Checkbox
                                                    indeterminateIcon={
                                                        <CheckBoxOutlineBlankIcon />
                                                    }
                                                    icon={
                                                        <IndeterminateCheckBoxIcon />
                                                    }
                                                    indeterminate={
                                                        lecture.attended_teacher ==
                                                        null
                                                    }
                                                    checked={
                                                        lecture.attended_teacher ==
                                                        true
                                                    }
                                                    disabled={true}
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            color: getCheckboxColor(
                                                                lecture,
                                                                lecture.attended_teacher
                                                            )
                                                        }
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Set Attendence">
                                                    <IconButton
                                                        // onClick={() => {
                                                        //     (
                                                        //         false,
                                                        //         user.username
                                                        //     );
                                                        // }}
                                                        sx={{
                                                            "&.MuiButtonBase-root:hover":
                                                                {
                                                                    bgcolor:
                                                                        "transparent",
                                                                    color: "gray"
                                                                }
                                                        }}
                                                    >
                                                        <GroupAddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Lecture">
                                                    <IconButton
                                                        onClick={() => {
                                                            deleteLecture(
                                                                lecture.id
                                                            );
                                                        }}
                                                        sx={{
                                                            "&.MuiButtonBase-root:hover":
                                                                {
                                                                    bgcolor:
                                                                        "transparent",
                                                                    color: "red"
                                                                }
                                                        }}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                        </div>
                    ))}
                </div>
            </Container>
        </RootPage>
    );
};

export default AttendancePage;
