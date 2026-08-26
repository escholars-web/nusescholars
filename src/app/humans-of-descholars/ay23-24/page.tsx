import React from "react";
import PageTemplate from "../../../../components/PageTemplate";
import PersonCards from "../../../../components/HumansPage/PersonCards";
import Header from "../../../../components/HumansPage/Header";
import BackLink from "../../../../components/HumansPage/BackLink";
import database from "../../../data/database.json";
import { buildMajorSections, InputData } from "../../../../functions/helpers";
import path from "path";

const App: React.FC = () => {
  const batchName: string = path.basename(__dirname);
  const baseLink = "/humans-of-descholars/" + batchName;

  type BatchData = Record<string, InputData>;
  //@ts-expect-error ignore to let batch name be processed as string
  const batchData: BatchData = database[batchName];

  // Design majors first, then engineering, both alphabetical. See
  // functions/helpers.ts.
  const sections = buildMajorSections(batchName, batchData, baseLink);

  return (
    <PageTemplate>
      <Header image="/images/batch-pics/AY2324-EScholars.jpg" title="AY23/24" />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <BackLink href="/humans-of-descholars" label="All batches" />
      </div>
      {sections.map((section) => (
        <PersonCards
          key={section.key}
          personCards={section.cards}
          title={section.title}
        />
      ))}
    </PageTemplate>
  );
};

export default App;
