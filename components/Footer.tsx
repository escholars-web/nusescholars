"use client";
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PestControlIcon from "@mui/icons-material/PestControl";
import Link from "next/link";

const Footer: React.FC = () => {
  const navLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Humans of DE-Scholars", href: "/humans-of-descholars" },
    { label: "Resources", href: "/resources" },
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
        <Link href="https://www.instagram.com/nusescholars" passHref>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton sx={{ color: "white" }} aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <Typography
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": { color: "gray" },
              }}
            >
              @nusescholars
            </Typography>
          </Box>
        </Link>
      </Box>

      {/* Column 3: Bug Reporting Form */}
      <Box sx={{ flex: "1 1 300px", marginBottom: "16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: "16px" }}
        >
          Having an issue?
        </Typography>
        <Link href="https://forms.office.com/r/5qTXrzmsei" passHref>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton sx={{ color: "white" }} aria-label="Bug-Report">
              <PestControlIcon />
            </IconButton>
            <Typography
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": { color: "gray" },
              }}
            >
              Bug Reporting Form
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
