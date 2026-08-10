import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DE-Scholars (Archived Version)",
  description:
    "Archived version of the NUS DE-Scholars website, preserved as it looked before the 2026 redesign.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ backgroundColor: "#e5e5e5" }}>{children}</section>;
}
