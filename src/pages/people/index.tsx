import RootPage from "../root";
import Container from "@mui/material/Container";
import "./people.css"; // Import CSS file for additional styling
import { useCallback, useEffect, useState } from "react";
import {
    deleteAuthCookies,
    backend_get,
    IsAdmin,
    backend_delete
} from "../../utils";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/common";
import { Button, IconButton, Typography, capitalize } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Avatar from "@mui/material/Avatar";
import CancelIcon from "@mui/icons-material/Cancel";

const People = () => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<User[]>();
    const alternatingColor = ["#424242", "#595959"];

    const getUserRole = async (role: string) => {
        const resp = await backend_get("user/getrole/" + role, true);
        return resp.json();
    };

    const fetchUsers = useCallback(async () => {
        try {
            const students_query = await getUserRole("student");
            const teachers_query = await getUserRole("teacher");
            if ("code" in students_query || "code" in teachers_query) {
                // Not authenticated anymore
                deleteAuthCookies();
                navigate("/login");
                navigate(0);
                return;
            }

            const students = !(
                "error" in students_query || "detail" in students_query
            )
                ? students_query
                : [];
            const teachers = !(
                "error" in teachers_query || "detail" in teachers_query
            )
                ? teachers_query
                : [];
            setAllUsers(teachers.concat(students));
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Show error on frontend
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, navigate]);

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

    const handleNewUserClick = () => {
        navigate(`/create_user`);
    };

    const handleProfileClick = (username: string) => {
        navigate(`/profile/${username}`);
    };

    const deleteUser = (username: string) => {
        backend_delete("/user/delete/" + username, true).then((resp) => {
            if (resp.ok) {
                if (allUsers == undefined) return;
                const tempUsers: User[] = [...allUsers];
                for (let i = 0; i < tempUsers.length; i++) {
                    if (tempUsers[i].username === username) {
                        tempUsers.splice(i, 1);
                        break;
                    }
                }
                setAllUsers(tempUsers);
            }
        });
    };

    return (
        <RootPage>
            <Container component="main" className="mainComponent">
                <Typography variant="h4" gutterBottom>
                    People
                    {IsAdmin() ? (
                        <IconButton
                            onClick={() => handleNewUserClick()}
                            style={{
                                marginLeft: "2%",
                                color: "white",
                                backgroundColor: "rgba(255, 255, 255, 0.5)"
                            }}
                        >
                            <AddCircleOutlineIcon style={{ fontSize: "1em" }} />
                        </IconButton>
                    ) : null}
                </Typography>

                <StyledTable>
                    <thead>
                        <tr>
                            <th className="avatar-column"></th>
                            <th>Name</th>
                            <th className="type-column">Role</th>
                            {IsAdmin() ? (
                                <th className="actions-column">Actions</th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers?.map((user: User, index: number) => (
                            <tr
                                key={user.id}
                                style={{
                                    backgroundColor: alternatingColor[index % 2]
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
                                            handleProfileClick(user.username)
                                        }
                                    >
                                        {`${user.first_name} ${user.last_name}`}
                                    </Button>
                                </td>
                                <td style={{ fontSize: "1em" }}>
                                    {capitalize(user.role)}
                                </td>
                                {IsAdmin() ? (
                                    <td className="actions-icon">
                                        <IconButton
                                            onClick={() => {
                                                deleteUser(user.username);
                                            }}
                                            sx={{
                                                "&.MuiButtonBase-root:hover": {
                                                    bgcolor: "transparent",
                                                    color: "red"
                                                }
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            </Container>
        </RootPage>
    );
};

export default People;
