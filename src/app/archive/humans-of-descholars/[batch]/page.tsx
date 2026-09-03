import React from "react";
import PageTemplate from "@components/archive/PageTemplate";
import PersonCards from "@components/archive/HumansPage/PersonCards";
import Header from "@components/archive/HumansPage/Header";
import database from "@/data/database.json";
import {
  getMajorName,
  transformStudentData,
  InputData,
} from "../../../../../functions/helpers";

const batchHeaders: Record<string, { image: string; title: string }> = {
  "ay21-22": {
    image: "/images/batch-pics/AY2122-EScholars.jpg",
    title: "AY21/22",
  },
  "ay22-23": {
    image: "/images/batch-pics/AY2223-EScholars.jpg",
    title: "AY22/23",
  },
  "ay23-24": {
    image: "/images/batch-pics/AY2324-EScholars.jpg",
    title: "AY23/24",
  },
  "ay24-25": {
    image: "/images/batch-pics/AY2425-EScholars.jpg",
    title: "AY24/25",
  },
  "ay25-26": {
    image: "/images/batch-pics/AY2526-Escholars.jpg",
    title: "AY25/26",
  },
};

export const dynamicParams = false;

/**
 * Only the batches the archive actually has a header for.
 *
 * The archive is a frozen copy of the previous site, so it does not grow when a
 * new intake is added to database.json. Deriving these from `batchHeaders`
 * rather than from the database keys is what stops a new batch from being
 * prerendered here with no header and crashing the build.
 */
export function generateStaticParams() {
  return Object.keys(batchHeaders)
    .filter((batch) => batch in database)
    .map((batch) => ({ batch }));
}

export default async function BatchPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const { batch: batchName } = await params;
  const baseLink = "/archive/humans-of-descholars/" + batchName;
  const header = batchHeaders[batchName];

  type BatchData = Record<string, InputData>;
  //@ts-expect-error ignore to let batch name be processed as string
  const batchData: BatchData = database[batchName];

  return (
    <PageTemplate>
      <Header image={header.image} title={header.title} />
      {Object.entries(batchData).map(([key, value]) => (
        <PersonCards
          key={key}
          personCards={transformStudentData(batchName, key, value, baseLink)}
          title={getMajorName(key)}
        />
      ))}
    </PageTemplate>
  );
}
