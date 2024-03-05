import { FC } from "react";
import Rootpage from "../root";
import { Box, Typography } from "@mui/material";
import backgroundImage from "../../assets/logo-clear.png";

const HomePage: FC = () => {
    return (
        <Rootpage>
            <Box
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    padding: 8,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "95vh", // Set height to 100% of viewport height
                    maxWidth: "95%"
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    Welcome to Attendunce
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    The ultimate attendance tracking solution
                </Typography>
            </Box>
        </Rootpage>
    );
};

export default HomePage;
