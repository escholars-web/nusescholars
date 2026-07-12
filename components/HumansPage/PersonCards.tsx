"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";

export interface PersonCardItem {
    image: string; // Image URL
    link: string; // Link URL
    name: string; // Name of the person
}

interface PersonCardsProps {
    personCards: PersonCardItem[];
    title: string; // Title of the section
}

const PersonCards: React.FC<PersonCardsProps> = ({ personCards, title }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const imagePromises = personCards.map((card) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = card.image;
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        Promise.all(imagePromises).then(() => setLoading(false));
    }, [personCards]);

    return (
        <Box
            sx={{
                margin: "0 auto",
                padding: "2rem 1rem",
                width: "70%",
                textAlign: "center",
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

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {personCards.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                                    },
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
            )}
        </Box>
    );
};

export default PersonCards;
