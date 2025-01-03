import React from "react";
import { Box, Grid, Typography } from "@mui/material";

interface LinkItem {
  title: string;
  image: string;
  link: string;
}

interface LinksProps {
  linkItems: LinkItem[]; // Array of gallery items
}

const LinkItems: React.FC<LinksProps> = ({ linkItems }) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <Grid container spacing={4}>
        {linkItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
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
                  bottom: "40%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "monospace",
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

export default LinkItems;
