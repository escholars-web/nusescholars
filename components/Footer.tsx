"use client";
import React from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";

const Footer: React.FC = () => {
  const navLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Humans of De-Scholars", href: "/humans-of-descholars" },
    { label: "Events", href: "/events" },
    { label: "Resources", href: "https://sites.google.com/view/nus-e-scholars/home?authuser=0" }, // De-Scholars Resource Google Site
  ];

  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        padding: "32px 16px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {/* Column 1: Logo and Navigation Links */}
      <Box sx={{ flex: "1 1 300px", marginBottom: "16px" }}>
        <Link href="/" passHref>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "16px",
              cursor: "pointer",
              textDecoration: "none", // Remove underline
              color: "inherit", // Inherit text color
              "&:hover": { color: "gray" }, // Add hover effect
            }}
          >
            NUS DE-SCHOLARS
          </Typography>
        </Link>
        {navLinks.map((link) => (
          <Box key={link.label} sx={{ marginBottom: "8px" }}>
            <Link href={link.href} passHref>
              <Typography
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: "gray" },
                }}
              >
                {link.label}
              </Typography>
            </Link>
          </Box>
        ))}
      </Box>

      {/* Column 2: Social Media Links */}
      <Box sx={{ flex: "1 1 300px", marginBottom: "16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: "16px" }}
        >
          Connect with Us!
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <IconButton sx={{ color: "white" }} aria-label="Facebook">
            <FacebookIcon />
          </IconButton>
          <Typography>nusdescholars...</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconButton sx={{ color: "white" }} aria-label="Instagram">
            <InstagramIcon />
          </IconButton>
          <Typography>nusdescholars...</Typography>
        </Box>
      </Box>

      {/* Column 3: Newsletter */}
      <Box sx={{ flex: "1 1 300px", marginBottom: "16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: "16px" }}
        >
          Email Newsletter
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Email"
            variant="outlined"
            size="small"
            sx={{
              flex: "1",
              backgroundColor: "white",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            &gt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
