import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { GitHub } from "@mui/icons-material";
import Image from "next/image";
import InformationBox from "./InformationBox";

interface ProfileProps {
  name: string;
  academicYear: string;
  bachelors: string;
  masters?: string | null;
  introduction: string;
  interestsAndHobbies: string;
  notableAchievements: string;
  imageUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  githubUrl: string;
  lastUpdated: string;
}

const Profile: React.FC<ProfileProps> = ({
  name,
  academicYear,
  bachelors,
  masters,
  introduction,
  interestsAndHobbies,
  notableAchievements,
  imageUrl,
  linkedInUrl,
  instagramUrl,
  githubUrl,
  lastUpdated,
}) => {
  const showConnectWithMe: boolean = !!(
    linkedInUrl ||
    instagramUrl ||
    githubUrl
  );

  const socials = [
    {
      url: linkedInUrl,
      label: "LinkedIn",
      icon: <LinkedInIcon fontSize="medium" />,
    },
    {
      url: instagramUrl,
      label: "Instagram",
      icon: <InstagramIcon fontSize="medium" />,
    },
    { url: githubUrl, label: "GitHub", icon: <GitHub fontSize="medium" /> },
  ].filter((s) => s.url);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-10">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="shrink-0">
            <Image
              src={imageUrl}
              alt={`${name}'s photo`}
              width={225}
              height={281}
              className="rounded-xl object-cover ring-4 ring-nus-blue-50"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-nus-orange-700">
              Humans of DE-Scholars
            </p>
            <h1 className="mt-2 text-3xl font-bold text-nus-blue-600">
              Hi! I&apos;m {name}
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-nus-blue-50 px-3 py-1 text-xs font-semibold text-nus-blue-700">
                Batch {academicYear}
              </span>
              <span className="rounded-full bg-nus-orange-50 px-3 py-1 text-xs font-semibold text-nus-orange-700">
                {bachelors}
              </span>
            </div>
            <p className="mt-4 leading-7 text-slate-600">
              I&apos;m a {bachelors} student from Batch {academicYear}.
              {masters && <> Additionally, I&apos;m pursuing my {masters}.</>}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <hr className="my-8 border-[--border]" />

        {/* More About Me Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-nus-blue-600">
            More about me!
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
        </div>
        <p className="mt-6 leading-7 text-slate-600">{introduction}</p>

        {/* Notable Achievements Section */}
        {notableAchievements && (
          <InformationBox
            header={"Notable Achievements"}
            data={notableAchievements}
          />
        )}

        {/* Interests and Hobbies Section */}
        {interestsAndHobbies && (
          <InformationBox
            header={"Interests & Hobbies"}
            data={interestsAndHobbies}
          />
        )}

        {/* Connect With Me Section */}
        {showConnectWithMe && (
          <>
            <hr className="my-8 border-[--border]" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-nus-blue-600">
                Connect with me!
              </h2>
              <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
            </div>
            <div className="mt-6 flex justify-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full bg-nus-blue-50 p-3 text-nus-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-nus-blue-600 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default Profile;
