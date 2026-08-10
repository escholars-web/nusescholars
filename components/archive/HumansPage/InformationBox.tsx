import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

interface InformationBoxProps {
  header: string;
  data: string;
}

export default function InformationBox({ header, data }: InformationBoxProps) {
  return (
    <Box>
      <Divider sx={{ my: 4 }} />
      <Typography
        variant="h4"
        align="center"
        fontFamily="monospace"
        sx={{ fontWeight: "bold", mb: 3, mt: 4 }}
      >
        {header}
      </Typography>
      <List>
        {data.split("\n").map((achievement, index) => (
          <ListItem key={index} disableGutters>
            <ListItemText primary={`• ${achievement}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
