import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface LandingImageProps {
  imageUrl: string; // URL for the background image
  title?: string; // Optional overlay title
}

const LandingImage: React.FC<LandingImageProps> = ({ imageUrl, title }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {title && (
        <Typography
          variant="h3"
          sx={{
            position: "absolute",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default LandingImage;
