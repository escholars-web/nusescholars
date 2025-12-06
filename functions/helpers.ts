export type InputData = Record<string, { name: string }>;

export function transformStudentData(
  batch: string,
  major: string,
  inputData: InputData,
  baseLink: string,
): { image: string; link: string; name: string }[] {
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
  } else if (key == 'IPM') {
    return "Infrastructure & Project Management";
  } else if (key === "masters") {
    return "Masters Students";
  }

  return "no major";
}
