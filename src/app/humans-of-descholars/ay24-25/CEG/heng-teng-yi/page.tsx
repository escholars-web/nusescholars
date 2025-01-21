import PageTemplate from "../../../../../../components/PageTemplate";
import ProfileBuilder from "../../../../../../components/HumansPage/ProfileBuilder";
import * as path from "path";

export default function ProfilePage() {
  const studentName: string = path.basename(__dirname);

  const majorNamePath = path.dirname(__dirname);
  const majorName = path.basename(majorNamePath);

  const batchNamePath = path.dirname(majorNamePath);
  const batchName = path.basename(batchNamePath);

  return (
    <PageTemplate>
      <ProfileBuilder name={studentName} batch={batchName} major={majorName} />
    </PageTemplate>
  );
}
