import PageTemplate from "../../components/PageTemplate";
import LandingPage from "../../components/LandingPage";
import ConsentPopup from "../../components/ConsentPopup";

export const metadata = {
    title: "NUS D&E-SCHOLARS WEBSITE",
    description: "This is the student-run website for NUS D&E-Scholars.",
    keywords: ["NUS", "Design Scholars", "Engineering Scholars", "D&E Scholars"],
    authors: [{ name: "Matthew Yip / Yeo Meng Han" }],
    openGraph: {
        title: "NUS D&E Scholars website",
        description: "This is an SEO-optimized page using Next.js.",
        url: "https://nusdescholars.com",
        siteName: "NUS D&E Scholars",
        images: [
            {
                url: "https://nusdescholars.com",
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
    },
    alternates: {
        canonical: "https://nusdescholars.com",
    },
};

export default function Page() {
  return (
    <PageTemplate>
      <ConsentPopup />
      <LandingPage />
    </PageTemplate>
  );
}
