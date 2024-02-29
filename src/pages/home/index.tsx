import React, { FC } from "react";
import Rootpage from "../root";
import { Box, Button, Typography } from "@mui/material";
import backgroundImage from "../../assets/logo.png";

const HomePage: FC = () => {
  return (
    <Rootpage>
      <Box
        sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "black",
            padding: 8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "85vh",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom justifyContent={'center'}>
          Welcome to Attendunce
        </Typography>
        <Typography variant="subtitle1" gutterBottom >
          The ultimate attendance tracking solution
        </Typography>
      </Box>
    </Rootpage>
  );
};

export default HomePage;
