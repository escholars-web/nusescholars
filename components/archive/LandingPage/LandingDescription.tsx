import React from "react";
import { Box, Typography } from "@mui/material";

interface LandingDescriptionProps {
  text: string; // Text to display in the description
}

const LandingDescription: React.FC<LandingDescriptionProps> = ({ text }) => {
  return (
    <Box
      sx={{
        width: "70%",
        margin: "0 auto",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontSize: "1.2rem", lineHeight: "1.8" }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default LandingDescription;
