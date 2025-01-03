import PageTemplate from "../../../components/PageTemplate";
import LinkItems from "../../../components/HumansPage/LinkItems";
import HeroSection from "../../../components/HeroSection";
import Typography from "@mui/material/Typography";

export default function Page() {
  const baseLink = "/humans-of-descholars/";
  const batchItems = [
    {
      title: "AY21/22",
      image: "/images/orientation2024.jpg",
      link: baseLink + "ay21-22",
    },
    {
      title: "AY22/23",
      image: "/images/orientation2024.jpg",
      link: baseLink + "ay22-23",
    },
    {
      title: "AY23/24",
      image: "/images/orientation2024.jpg",
      link: baseLink + "ay23-24",
    },
    {
      title: "AY24/25",
      image: "/images/orientation2024.jpg",
      link: baseLink + "ay24-25",
    },
  ];

  return (
    <PageTemplate>
      <HeroSection
        title="Humans of DE-Scholars"
        description="Welcome to the Humans of DE-scholars page! Select the batch below to
        find out more about us :)"
      />
      <LinkItems linkItems={batchItems} />
    </PageTemplate>
  );
}
