import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface PersonCardProps {
  name: string;
  image: string;
  onClick: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, image, onClick }) => {
  return (
    <Card sx={{ maxWidth: 150 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          image={image}
          alt={name}
          sx={{
            borderRadius: "50%",
            objectFit: "cover",
            margin: "10px auto",
            width: 120,
          }}
        />
        <CardContent>
          <Typography variant="body1" textAlign="center">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PersonCard;
