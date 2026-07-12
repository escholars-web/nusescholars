import React from "react";
import { Box, Grid, Typography } from "@mui/material";

interface GalleryItem {
  title: string;
  image: string;
  link: string;
}

interface LandingGalleryLinksProps {
  galleryItems: GalleryItem[]; // Array of gallery items
}

const LandingGalleryLinks: React.FC<LandingGalleryLinksProps> = ({
  galleryItems,
}) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <Grid container spacing={4}>
        {galleryItems.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6}} key={index}>
            <Box
              component="a"
              href={item.link}
              sx={{
                display: "block",
                textDecoration: "none",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LandingGalleryLinks;
