import PageTemplate from "@components/archive/PageTemplate";
import ProfileBuilder from "@components/archive/HumansPage/ProfileBuilder";
import database from "@/data/database.json";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { batch: string; major: string; student: string }[] = [];
  for (const [batch, majors] of Object.entries(database)) {
    if (!batch.startsWith("ay") || typeof majors !== "object") continue;
    for (const [major, students] of Object.entries(majors)) {
      for (const student of Object.keys(students)) {
        params.push({ batch, major, student });
      }
    }
  }
  return params;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ batch: string; major: string; student: string }>;
}) {
  const { batch, major, student } = await params;
  return (
    <PageTemplate>
      <ProfileBuilder name={student} batch={batch} major={major} />
    </PageTemplate>
  );
}
