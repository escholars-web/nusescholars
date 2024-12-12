import React from "react";
import { Box, Typography } from "@mui/material";

interface HeaderProps {
  image: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ image, title }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "50px 0",
      }}
    >
      <Typography
        variant="h3"
        color="white"
        sx={{
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "inline-block",
          padding: "10px 20px",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default Header;
