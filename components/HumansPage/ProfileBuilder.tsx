// components/HumansPage/ProfileBuilder.tsx
// Build individual profile page for student based on database.json

import Profile_v2 from "./Profile_v2";
import database from "../../src/data/database.json";

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

  return (
    <Profile_v2
      name={data.name}
      academicYear={data.admit_year}
      bachelors={data.bachelors}
      masters={data.masters}
      introduction={data.writeup}
      interestsAndHobbies={data.interests_hobbies}
      notableAchievements={data.notable_achievements}
      imageUrl={`/images/${batch}/${name}.jpg`}
      linkedInUrl={data.linkedin_url}
      instagramUrl={data.instagram_url}
      githubUrl={data.github_url}
      lastUpdated={data.last_updated}
    />
  );
}
