import PageTemplate from "../../../components/PageTemplate";
import LinkItems from "../../../components/HumansPage/LinkItems";
import HeroSection from "../../../components/HeroSection";

export default function Page() {
  const baseLink = "/humans-of-descholars/";
  const batchItems = [
    {
      title: "AY25/26",
      image: "/images/batch-pics/AY2426-EScholars.jpg",
      link: baseLink + "ay25-26",
    },
    {
      title: "AY24/25",
      image: "/images/batch-pics/AY2425-EScholars.jpg",
      link: baseLink + "ay24-25",
    },
    {
      title: "AY23/24",
      image: "/images/batch-pics/AY2324-EScholars.jpg",
      link: baseLink + "ay23-24",
    },
    {
      title: "AY22/23",
      image: "/images/batch-pics/AY2223-EScholars.jpg",
      link: baseLink + "ay22-23",
    },
    {
      title: "AY21/22",
      image: "/images/batch-pics/AY2122-EScholars.jpg",
      link: baseLink + "ay21-22",
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
