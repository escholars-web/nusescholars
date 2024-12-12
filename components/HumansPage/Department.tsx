import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import PersonCard from "./PersonCard";

interface DepartmentProps {
  title: string;
  members: { name: string; image: string; onClick: () => void }[];
}

const Department: React.FC<DepartmentProps> = ({ title, members }) => {
  return (
    <Box sx={{ margin: "40px 0", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {members.map((member, index) => (
          <Grid item key={index}>
            <PersonCard {...member} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Department;
