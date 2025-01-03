import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { GitHub } from "@mui/icons-material";
import {
  Box,
  Typography,
  Link as MuiLink,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Image from "next/image";

interface ProfileProps {
  name: string;
  academicYear: string;
  course: string;
  introduction: string;
  interests: string;
  hobbies: string[];
  imageUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  githubUrl: string;
}

const Profile: React.FC<ProfileProps> = ({
  name,
  academicYear,
  course,
  introduction,
  interests,
  hobbies,
  imageUrl,
  linkedInUrl,
  instagramUrl,
  githubUrl,
}) => {
  return (
    <Box
      sx={{ maxWidth: 800, margin: "auto", padding: 4, typography: "body1" }}
    >
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, flexDirection: { xs: "column", md: "row" }}}>
        <Box sx={{ flexShrink: 0, position: "relative", mb: { xs: 2, md: 0 } }}>
          <Image
            src={imageUrl}
            alt={`${name}'s photo`}
            objectFit="cover"
            width={225}
            height={281}
            style={{ borderRadius: 8 }}
          />
        </Box>
        <Box sx={{ ml: 4, flexGrow: 1}}>
          <Typography variant="h4" sx={{fontFamily: "monospace", textAlign: "left"}} gutterBottom>
            Hi! I’m {name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontFamily: "monospace" }}>
            I study {course} as a {academicYear} year student.
            <br />
            Currently, I am working on... (customizable intro).
          </Typography>
          <Typography variant="body1" sx={{fontFamily: "monospace"}}>
            You can talk to me about... (customized topics).
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* More About Me Section */}
      <Typography
        variant="h4"
        align="center"
        fontFamily="monospace"
        sx={{ fontWeight: "bold", mb: 3, mt: 4}}
      >
        More about me!
      </Typography>
      <Typography variant="body1" paragraph>
        {introduction}
      </Typography>
      <Typography variant="body1" paragraph>
        {interests}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Notable Achievements Section */}
      <Typography
        variant="h4"
        align="center"
        fontFamily="monospace"
        sx={{ fontWeight: "bold", mb: 3, mt: 4 }}
      >
        Notable Achievements
      </Typography>
      <List>
        {hobbies.map((hobby, index) => (
          <ListItem key={index} disableGutters>
            <ListItemText primary={`• ${hobby}`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      {/* Connect With Me Section */}
      <Typography
        variant="h4"
        align="center"
        fontFamily="monospace"
        sx={{ fontWeight: "bold", mb: 3, mt: 4 }}
      >
        Connect with me!
      </Typography>
      <Stack direction="row" spacing={4} justifyContent="center">
        {linkedInUrl && (
          <MuiLink href={linkedInUrl} target="_blank" rel="noopener">
            <LinkedInIcon fontSize="large" color="primary" />
          </MuiLink>
        )}
        {instagramUrl && (
          <MuiLink href={instagramUrl} target="_blank" rel="noopener">
            <InstagramIcon fontSize="large" sx={{ color: "#E4405F" }} />
          </MuiLink>
        )}
        {githubUrl && (
          <MuiLink href={githubUrl} target="_blank" rel="noopener">
            <GitHub fontSize="large" sx={{ color: "black" }} />
          </MuiLink>
        )}
      </Stack>
    </Box>
  );
};

export default Profile;
