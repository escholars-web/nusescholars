// components/HumansPage/ProfileBuilder.tsx
// Build individual profile page for student based on database.json

import Profile_v2 from "./Profile_v2";
import database from "../../src/data/database.json";
import { formatBatchName } from "../../functions/helpers";
import { stripYearMentions } from "../../functions/writeups";

interface ProfileBuilderProps {
  name: string;
  batch: string;
  major: string;
}

export default function ProfileBuilder({
  name,
  batch,
  major,
}: ProfileBuilderProps) {
  //@ts-expect-error ignore to let names be processed as string
  const data = database[batch][major][name];

  // Write-ups are collected once at census time, so a line like "I am a Y1
  // student" is stale by the next August. Drop the year of study rather than
  // trying to keep it current, the Batch AY shown above the write-up says the
  // same thing and never expires. See functions/writeups.ts.
  const introduction = stripYearMentions(data.writeup);

  return (
    <Profile_v2
      name={data.name}
      academicYear={data.admit_year}
      bachelors={data.bachelors}
      masters={data.masters}
      introduction={introduction}
      interestsAndHobbies={data.interests_hobbies}
      notableAchievements={data.notable_achievements}
      imageUrl={`/images/${batch}/${name}.jpg`}
      linkedInUrl={data.linkedin_url}
      instagramUrl={data.instagram_url}
      githubUrl={data.github_url}
      lastUpdated={data.last_updated}
      backHref={`/humans-of-descholars/${batch}`}
      backLabel={`Back to ${formatBatchName(batch)}`}
    />
  );
}
