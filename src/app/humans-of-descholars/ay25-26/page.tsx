import React from "react";
import PageTemplate from "../../../../components/PageTemplate";
import PersonCards from "../../../../components/HumansPage/PersonCards";
import Header from "../../../../components/HumansPage/Header";
import database from "../../../data/database.json";
import {
  getMajorName,
  transformStudentData,
  InputData,
} from "../../../../functions/helpers";
import path from "path";

const App: React.FC = () => {
  const batchName: string = path.basename(__dirname);
  const baseLink = "/humans-of-descholars/" + batchName;

  type BatchData = Record<string, InputData>;
  //@ts-expect-error ignore to let batch name be processed as string
  const batchData: BatchData = database[batchName];

  return (
    <PageTemplate>
      <Header image="/images/batch-pics/AY2526-EScholars.jpg" title="AY25/26" />
      {Object.entries(batchData).map(([key, value]) => (
        <PersonCards
          key={key}
          personCards={transformStudentData(batchName, key, value, baseLink)}
          title={getMajorName(key)}
        />
      ))}
    </PageTemplate>
  );
};

export default App;
