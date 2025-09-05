import { createClient } from "../../utils/supabase/server";
import PageTemplate from "../../../components/PageTemplate";
import HeroSection from "../../../components/HeroSection";
import LinkItems from "../../../components/HumansPage/LinkItems";

export default async function Page() {
  const supabase = createClient();
  const { data: batches } = await supabase.from("batches").select("*");

  const baseLink = "/humans-of-descholars/";
  const batchItems = (batches ?? []).map((b) => ({
    title: b.name,
    image: `/images/batch-pics/${b.code}-EScholars.jpg`,
    link: baseLink + b.code,
  }));

  return (
    <PageTemplate>
      <HeroSection
        title="Humans of DE-Scholars"
        description="Welcome to the Humans of DE-Scholars! Select the batch below to
        find out more about us :)"
      />
      <LinkItems linkItems={batchItems} />
    </PageTemplate>
  );
}
