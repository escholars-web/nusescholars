import Profile_v2 from "./Profile_v2";

interface ProfileBuilderProps {
  scholar: any; // you can create a proper type for scholar too
}

export default function ProfileBuilder({ scholar }: ProfileBuilderProps) {
  // directly use scholar object
  return (
    <Profile_v2
      name={scholar.name}
      academicYear={scholar.admit_year ?? ""}
      course={scholar.major ?? scholar.programs?.name ?? ""}
      introduction={scholar.formatted_writeup ?? ""}
      interestsAndHobbies={scholar.formatted_interests_hobbies ?? ""}
      notableAchievements={scholar.formatted_achievements ?? ""}
      imageUrl={`/images/${scholar.batches.code}/${scholar.slug}.jpg`}
      linkedInUrl={scholar.linkedin_url ?? ""}
      instagramUrl={scholar.instagram_url ?? ""}
      githubUrl={scholar.github_url ?? ""}
    />
  );
}
