import RootPage from "../root";
import Container from "@mui/material/Container";
import "./people.css"; // Import CSS file for additional styling
import { useEffect, useState } from "react";
import { deleteAuthCookies, get_db, IsAdmin } from "../../utils";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/common";
import { Button, IconButton , Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';

const People = () => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<User[]>();
    const alternatingColor = ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)'];

    const getUserRole = async (role : string) => {
        const resp = await get_db("user/getrole/" + role, true);
        return resp.json();
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const students_query = await getUserRole("students");
                const teachers_query = await getUserRole("teachers");
                if ("code" in students_query || "code" in teachers_query) {
                    // Not authenticated anymore
                    deleteAuthCookies();
                    navigate("/login");
                    navigate(0);
                    return;
                }

                const students = (!("error" in students_query || "detail" in students_query)) ? students_query : {}
                const teachers = (!("error" in teachers_query || "detail" in teachers_query)) ? teachers_query : {}
                setAllUsers(students.concat(teachers))
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Show error on frontend
            }
        };

        fetchUsers();
    }, [navigate]);

    const StyledTable = styled('table')({
        borderCollapse: 'collapse',
        width: '100%',
        '& th, & td': {
            padding: '8px', // Adjust the padding as needed
            borderBottom: '1px solid #ddd', // Add a border bottom to create a divider effect
            textAlign: 'left', // Align content to the left
        },
        '& th': {
            // backgroundColor: '#f2f2f2', // Add background color to header cells if needed
            fontWeight: 'bold', // Add bold font weight to header cells if needed
        },
        '& .type-column': {
            width: '10%', // Adjust the width of the actions column
            textAlign: 'left', // Align content to the left
        },
        '& .actions-column': {
            width: '5%', // Adjust the width of the actions column
            textAlign: 'left', // Align content to the left
        },
        '& .avatar-column': {
            width: '5%', // Adjust the width of the avatar column
            textAlign: 'left', // Align content to the left
        },
        '& .actions-icon': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <RootPage>
                <Container component="main">
                    <Typography variant="h4" gutterBottom>
                        People
                    </Typography>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th className="avatar-column"></th>
                                <th>Name</th>
                                <th className="type-column">Role</th>
                                {IsAdmin() ? <th className="actions-column">Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers?.map((user: User, index: number) => (
                                <tr key={user.id} style={{ backgroundColor: alternatingColor[index % alternatingColor.length] }}>
                                    <td className="avatar-column">
                                        <Avatar alt={`${user.first_name} ${user.last_name}`} />
                                    </td>
                                    <td><Button>{`${user.first_name} ${user.last_name}`}</Button></td>
                                    <td>{user.role}</td>
                                    {IsAdmin() ? <td className="actions-icon">
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </td> : null}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </Container>
        </RootPage>
    );
};

export default People;
