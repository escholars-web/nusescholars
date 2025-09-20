"use client";
import React, { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  // Links for navigation
  const navLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Humans of D&E-Scholars", href: "/humans-of-descholars" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{ backgroundColor: "#CDCDCD" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand Name */}
        <Link href="/" passHref>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            NUS D&E-SCHOLARS
          </Typography>
        </Link>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" }, // Hide on small screens
            gap: "16px",
          }}
        >
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} passHref>
              <Button color="inherit">{link.label}</Button>
            </Link>
          ))}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          onClick={toggleMobileMenu}
          sx={{ display: { xs: "flex", md: "none" } }} // Show on small screens
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": { width: "250px" },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                onClick={toggleMobileMenu}
                component="a"
                href={link.href}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
