import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { GitHub } from "@mui/icons-material";
import {
  Box,
  Typography,
  Link as MuiLink,
  Stack,
  Divider,
} from "@mui/material";
import Image from "next/image";
import InformationBox from "./InformationBox";

interface ProfileProps {
  name: string;
  academicYear: string;
  bachelors: string;
  masters?: string | null;
  introduction: string;
  interestsAndHobbies: string;
  notableAchievements: string;
  imageUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  githubUrl: string;
  lastUpdated: string;
}

const Profile: React.FC<ProfileProps> = ({
  name,
  academicYear,
  bachelors,
  masters,
  introduction,
  interestsAndHobbies,
  notableAchievements,
  imageUrl,
  linkedInUrl,
  instagramUrl,
  githubUrl,
  lastUpdated,
}) => {
  const showConnectWithMe: boolean = !!(
    linkedInUrl ||
    instagramUrl ||
    githubUrl
  );

  return (
    <Box
      sx={{ maxWidth: 800, margin: "auto", padding: 4, typography: "body1" }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
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
        <Box sx={{ ml: 4, flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: "monospace", textAlign: "left" }}
            gutterBottom
          >
            Hi! I&apos;m {name}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, fontFamily: "monospace" }}>
            I&apos;m a {bachelors} student from Batch {academicYear}. 
            {masters && (
              <> Additionally, I&apos;s pursuing my {masters}.</>
            )}
          </Typography>
          {/* <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
            You can talk to me about... (customized topics).
          </Typography> */}
          <Typography variant="caption" sx={{ mb: 2, fontFamily: "monospace", color: "gray" }}>
            Last updated: {lastUpdated}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* More About Me Section */}
      <Typography
        variant="h4"
        align="center"
        fontFamily="monospace"
        sx={{ fontWeight: "bold", mb: 3, mt: 4 }}
      >
        More about me!
      </Typography>
      <Typography variant="body1" paragraph>
        {introduction}
      </Typography>

      {/* Notable Achievements Section */}
      {notableAchievements && (
        <InformationBox
          header={"Notable Achievements"}
          data={notableAchievements}
        />
      )}

      {/* Interests and Hobbies Section */}
      {interestsAndHobbies && (
        <InformationBox
          header={"Interests & Hobbies"}
          data={interestsAndHobbies}
        />
      )}

      {showConnectWithMe && <Divider sx={{ my: 4 }} />}

      {/* Connect With Me Section */}
      {showConnectWithMe && (
        <Typography
          variant="h4"
          align="center"
          fontFamily="monospace"
          sx={{ fontWeight: "bold", mb: 3, mt: 4 }}
        >
          Connect with me!
        </Typography>
      )}
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
