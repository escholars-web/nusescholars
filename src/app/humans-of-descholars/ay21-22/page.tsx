import React from "react";
import Header from "../../../../components/HumansPage/Header";
import Department from "../../../../components/HumansPage/Department";
import PageTemplate from "../../../../components/PageTemplate";
import { Container } from "@mui/material";

const App: React.FC = () => {
  const handleMemberClick = (name: string) => {
    alert(`You clicked on ${name}`);
  };

  const biomedicalMembers = [
    {
      name: "John Doe",
      image: "/path-to-image.jpg",
      onClick: () => handleMemberClick("John Doe"),
    },
    {
      name: "Jane Smith",
      image: "/path-to-image.jpg",
      onClick: () => handleMemberClick("Jane Smith"),
    },
  ];

  const chemicalMembers = [
    {
      name: "Alice Johnson",
      image: "/path-to-image.jpg",
      onClick: () => handleMemberClick("Alice Johnson"),
    },
    {
      name: "Bob Brown",
      image: "/path-to-image.jpg",
      onClick: () => handleMemberClick("Bob Brown"),
    },
  ];

  return (
    <PageTemplate>
      <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
        <Header image="/images/orientation2024.jpg" title="AY21/22" />
        <Department
          title="Biomedical Engineering"
          members={biomedicalMembers}
        />
        <Department title="Chemical Engineering" members={chemicalMembers} />
      </Container>
    </PageTemplate>
  );
};

export default App;
