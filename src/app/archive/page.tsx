import PageTemplate from "@components/archive/PageTemplate";
import LandingPage from "@components/archive/LandingPage";

export const metadata = {
  title: "NUS DE-SCHOLARS WEBSITE (Archived)",
  description:
    "Archived landing page of the student-run website for NUS DE-Scholars.",
};

export default function Page() {
  return (
    <PageTemplate>
      <LandingPage />
    </PageTemplate>
  );
}
