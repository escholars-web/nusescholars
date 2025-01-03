import React from "react";
import { Box, Typography } from "@mui/material";

interface HeroSectionProps {
  title: string;
  description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#d8d8d8",
        color: "#000000",
        textAlign: "center",
        py: 3, // padding in Y-axis (top and bottom)
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "2.25rem", // equivalent to 36px
          fontWeight: "bold",
          fontFamily: "monospace",
          mb: 1, // margin bottom
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{fontFamily: "monospace"}}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default HeroSection;
