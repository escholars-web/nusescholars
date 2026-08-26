export interface Student {
  name: string;
  /** The degree they read. Present for D-Scholars, often absent for E-Scholars. */
  bachelors?: string | null;
}

export type InputData = Record<string, Student>;

export interface PersonCard {
  image: string;
  link: string;
  name: string;
}

export interface MajorSection {
  /** Stable React key. */
  key: string;
  /** Heading above the cards, always the major itself. */
  title: string;
  cards: PersonCard[];
}

export function transformStudentData(
  batch: string,
  major: string,
  inputData: InputData,
  baseLink: string,
): PersonCard[] {
  return Object.entries(inputData).map(([key, value]) => ({
    image: "/images/" + batch + "/" + key + ".jpg",
    link: baseLink + "/" + major + "/" + key,
    name: value.name,
  }));
}

export function getMajorName(key: string): string {
  if (key === "MPE") {
    return "Mechanical Engineering";
  } else if (key === "EEE") {
    return "Electrical Engineering";
  } else if (key === "BME") {
    return "Biomedical Engineering";
  } else if (key === "ESP") {
    return "Engineering Science Programme";
  } else if (key === "EVE") {
    return "Environmental and Sustainability Engineering";
  } else if (key === "ISE") {
    return "Industrial and Systems Engineering";
  } else if (key === "MLE") {
    return "Material Science and Engineering";
  } else if (key === "CEG") {
    return "Computer Engineering";
  } else if (key === "CHE") {
    return "Chemical Engineering";
  } else if (key === "CVE") {
    return "Civil Engineering";
  } else if (key === "DS") {
    return "Design Scholars";
  } else if (key == "IPM") {
    return "Infrastructure & Project Management";
  } else if (key === "masters") {
    return "Masters Students";
  }

  return "no major";
}

/**
 * The three degrees D-Scholars read. Everyone in the `DS` folder is split into
 * these rather than shown under one "Design Scholars" heading, so a section
 * heading is always a major and never a programme.
 */
const DESIGN_MAJORS = [
  "Architecture",
  "Industrial Design",
  "Landscape Architecture",
];

/** Sections are grouped before they are sorted, design first and masters last. */
function sectionRank(title: string): number {
  if (DESIGN_MAJORS.includes(title)) {
    return 0;
  }
  return title === getMajorName("masters") ? 2 : 1;
}

function designMajorOf(student: Student): string {
  const bachelors = (student.bachelors ?? "").trim();
  return DESIGN_MAJORS.includes(bachelors) ? bachelors : getMajorName("DS");
}

/**
 * Every section of person cards for one batch, in the order they should appear:
 * the design majors first, then the engineering majors, both alphabetically,
 * with master's students last.
 *
 * Splitting `DS` by degree only changes the headings. Links still point at the
 * `DS` route segment, because that is where the profile pages live on disk.
 */
export function buildMajorSections(
  batch: string,
  batchData: Record<string, InputData>,
  baseLink: string,
): MajorSection[] {
  const sections: MajorSection[] = [];

  for (const [majorKey, students] of Object.entries(batchData)) {
    if (majorKey !== "DS") {
      sections.push({
        key: majorKey,
        title: getMajorName(majorKey),
        cards: transformStudentData(batch, majorKey, students, baseLink),
      });
      continue;
    }

    const byDegree = new Map<string, InputData>();
    for (const [slug, student] of Object.entries(students)) {
      const title = designMajorOf(student);
      const group = byDegree.get(title) ?? {};
      group[slug] = student;
      byDegree.set(title, group);
    }
    for (const [title, group] of byDegree) {
      sections.push({
        key: `${majorKey}-${title}`,
        title,
        cards: transformStudentData(batch, majorKey, group, baseLink),
      });
    }
  }

  return sections.sort(
    (a, b) =>
      sectionRank(a.title) - sectionRank(b.title) ||
      a.title.localeCompare(b.title),
  );
}

/** "ay25-26" reads as "AY25/26" everywhere it is shown to a person. */
export function formatBatchName(batch: string): string {
  const match = /^ay(\d{2})-(\d{2})$/.exec(batch);
  return match ? `AY${match[1]}/${match[2]}` : batch.toUpperCase();
}
