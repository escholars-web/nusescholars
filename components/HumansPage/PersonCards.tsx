import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export interface PersonCardItem {
  image: string; // Image URL
  link: string; // Link URL
  name: string; // Name of the person
}

interface PersonCardsProps {
  personCards: PersonCardItem[];
  title: string; // Array of person cards
}

const PersonCards: React.FC<PersonCardsProps> = ({ personCards, title }) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "2rem 1rem",
        width: "70%",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          fontFamily: "monospace",
          mb: "20px",
          }}
        >
        {title}
      </Typography>
      <Grid container spacing={4}>
        {personCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              component="a"
              href={card.link}
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
                src={card.image}
                alt={card.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                marginTop: "0.5rem",
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {card.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonCards;
