import { createClient } from "../../../utils/supabase/server";
import PageTemplate from "../../../../components/PageTemplate";
import Header from "../../../../components/HumansPage/Header";
import PersonCards from "../../../../components/HumansPage/PersonCards";

export default async function Page({ params }: { params: { batch: string } }) {
  const batch = params.batch;
  const supabase = createClient();

const { data: batchInfo } = await supabase
  .from("batches")
  .select("id, name, code")
  .eq("code", batch)
  .single();

const { data: scholars } = await supabase
  .from("scholars")
  .select("*, programs(name)")
  .eq("batch_id", batchInfo?.id);

  const groupedByMajor = (scholars ?? []).reduce((acc, scholar) => {
    const major = scholar.programs.name;
    if (!acc[major]) acc[major] = [];
    acc[major].push(scholar);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <PageTemplate>
      <Header
        title={`${batchInfo?.name ?? batch}`}
        image={`/images/batch-pics/${batch}-EScholars.jpg`}
      />
      {Object.entries(groupedByMajor).map(([major, students]) => (
        <PersonCards
          key={major}
          title={major}
          personCards={students.map((s) => ({
            name: s.name,
            image: `/images/${batch}/${s.slug}.jpg`,
            link: `/humans-of-descholars/${batch}/${s.slug}`,
          }))}
        />
      ))}
    </PageTemplate>
  );
}
