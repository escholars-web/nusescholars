"use client";
import React from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, Stack, Typography } from "@mui/material";

interface PageTemplateProps {
  children: React.ReactNode; // Allows any React content to be passed as children
}

// Archived version of the original site template (pre-2026 redesign).
const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  return (
    <Stack sx={{ minHeight: "100vh", backgroundColor: "#e5e5e5" }}>
      <Box
        sx={{
          backgroundColor: "#171717",
          color: "#ffffff",
          textAlign: "center",
          padding: "6px 16px",
        }}
      >
        <Typography variant="body2" component="span">
          You are viewing the archived version of the DE-Scholars website.{" "}
        </Typography>
        <Link
          href="/"
          style={{ color: "#ffb366", textDecoration: "underline" }}
        >
          Go to the new site →
        </Link>
      </Box>
      <Navbar />
      <Stack component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Stack>
      <Footer />
    </Stack>
  );
};

export default PageTemplate;
