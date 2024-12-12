import Profile from "../../../../../components/Profile";
import PageTemplate from "../../../../../components/PageTemplate";

export default function ProfilePage() {
  return (
    <PageTemplate>
      <Profile
        name="Matthew Yip"
        academicYear="AY22/23"
        course="Mechanical Engineering"
        introduction="Hi there! Matthew here, Y3 ME."
        interests="My interest particularly lies in F1 and 3D printing."
        hobbies={["F1", "3D printing", "Web dev"]}
        imageUrl="/images/ay22-23/matthew-yip.jpg"
        linkedInUrl="https://nusmods.com"
      />
    </PageTemplate>
  );
}
