import RootPage from "../root";
import Container from "@mui/material/Container";
import "./attendence.css"; // Import CSS file for additional styling
import { useCallback, useEffect, useState } from "react";
import { useAxiosRequest, IsStudent, backend_post } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { Empty, FullLecture, FullLectureUser } from "../../types/common";
import { Button, Checkbox, Typography, capitalize } from "@mui/material";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const LectureAttendence = () => {
    const navigate = useNavigate();
    const { response, error, sendRequest } = useAxiosRequest<
        Empty,
        FullLecture
    >();
    const [lecture_data, setLectureData] = useState<FullLecture>();
    const alternatingColor = ["#424242", "#595959"];
    const { id } = useParams();

    const getLectureData = useCallback(() => {
        sendRequest({
            method: "GET",
            route: `lecture/${id}/get_teacher_att`,
            useJWT: true
        });
    }, [id, sendRequest]);

    useEffect(() => {
        getLectureData();
    }, [sendRequest, getLectureData]);

    useEffect(() => {
        if (response) setLectureData(response);
    }, [response]);

    if (error) {
        console.error("Error fetching courses:", error);
    }

    const StyledTable = styled("table")({
        borderCollapse: "collapse",
        width: "100%",
        "& th, & tr": {
            padding: "8px",
            borderBottom: "1px solid #ddd",
            textAlign: "left"
        },
        "& td": {
            padding: "8px",
            textAlign: "left"
        },
        "& th": {
            fontWeight: "bold" // Add bold font weight to header cells if needed
        },
        "& .type-column": {
            width: "10%", // Adjust the width of the actions column
            textAlign: "left" // Align content to the left
        },
        "& .actions-column": {
            width: "5%", // Adjust the width of the actions column
            textAlign: "left" // Align content to the left
        },
        "& .avatar-column": {
            width: "5%", // Adjust the width of the avatar column
            textAlign: "left" // Align content to the left
        },
        "& .actions-icon": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    const handleProfileClick = (username: string) => {
        navigate(`/profile/${username}`);
    };

    const getCheckboxColor = (attended: boolean) => {
        if (attended == true) return "green";
        if (attended == false) return "rgb(224, 6, 31)";
        return "white";
    };

    const handleAttendanceChange = (username: string, attended: boolean) => {
        const json_body = {
            usernames: { [username]: `${attended}` }
        };
        console.log(json_body);
        backend_post(
            `lecture/${id}/teacher_att`,
            JSON.stringify(json_body),
            true
        )
            .then(() => getLectureData())
            .catch((error) => console.log(error));
    };

    const getDate = (datetime_str: string | undefined) => {
        if (datetime_str == undefined) return "";
        return new Date(Date.parse(datetime_str)).toLocaleString();
    };

    return (
        <RootPage>
            <Container component="main" className="mainComponent">
                <Typography component="h1" variant="h4">
                    {lecture_data?.course_name}
                </Typography>

                <Typography component="h1" variant="h5" gutterBottom>
                    {lecture_data != undefined
                        ? capitalize(lecture_data.lecture_type)
                        : null}
                </Typography>

                <Typography variant="h6">
                    {`Start time: ${getDate(lecture_data?.start_time)}`}
                </Typography>
                <Typography variant="h6">
                    {`End time: ${getDate(lecture_data?.end_time)}`}
                </Typography>

                <StyledTable>
                    <thead>
                        <tr>
                            <th className="avatar-column"></th>
                            <th>Name</th>
                            <th className="type-column">Attendence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecture_data?.students.map(
                            (user: FullLectureUser, index: number) => (
                                <tr
                                    style={{
                                        backgroundColor:
                                            alternatingColor[index % 2]
                                    }}
                                >
                                    <td className="avatar-column">
                                        <Avatar
                                            alt={`${user.first_name} ${user.last_name}`}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            style={{
                                                color: "white",
                                                textTransform: "none",
                                                fontSize: "1em"
                                            }}
                                            sx={{
                                                "&.MuiButtonBase-root:hover": {
                                                    bgcolor: "transparent",
                                                    textDecoration: "underline"
                                                }
                                            }}
                                            onClick={() =>
                                                handleProfileClick(
                                                    user.username
                                                )
                                            }
                                        >
                                            {`${user.first_name} ${user.last_name}`}
                                        </Button>
                                    </td>
                                    {!IsStudent() ? (
                                        <Checkbox
                                            indeterminateIcon={
                                                <CheckBoxOutlineBlankIcon />
                                            }
                                            icon={<IndeterminateCheckBoxIcon />}
                                            indeterminate={
                                                user.attended == null
                                            }
                                            checked={user.attended == true}
                                            onChange={() =>
                                                handleAttendanceChange(
                                                    user.username,
                                                    !user.attended
                                                )
                                            }
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    color: getCheckboxColor(
                                                        user.attended
                                                    )
                                                }
                                            }}
                                        />
                                    ) : null}
                                </tr>
                            )
                        )}
                    </tbody>
                </StyledTable>
            </Container>
        </RootPage>
    );
};

export default LectureAttendence;
