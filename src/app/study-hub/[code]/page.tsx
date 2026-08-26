import React from "react";
import CourseDetail from "../../../../components/StudyHubPage/CourseDetail";
import reviews from "../../../data/module-reviews.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return reviews.modules.map((m) => ({ code: m.code.toLowerCase() }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <CourseDetail code={code} />;
}
