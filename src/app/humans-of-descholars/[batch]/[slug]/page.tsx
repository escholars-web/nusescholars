import { createClient } from "../../../../utils/supabase/server";
import { notFound } from "next/navigation";
import PageTemplate from "../../../../../components/PageTemplate";
import ProfileBuilder from "../../../../../components/HumansPage/ProfileBuilder";

export default async function Page({
  params,
}: {
  params: { batch: string; major: string; slug: string };
}) {
  const { batch, major, slug } = params;
  const supabase = createClient();

  const { data: scholar } = await supabase
    .from("scholars")
    .select("*, programs(name), batches(code)")
    .eq("slug", slug)
    .single();

  if (!scholar) return notFound();

  return (
    <PageTemplate>
      <ProfileBuilder scholar={scholar} />
    </PageTemplate>
  );
}
