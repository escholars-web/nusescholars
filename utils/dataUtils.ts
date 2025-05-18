export interface StudentProfile {
  name: string | null;
  admit_year: string | null;
  academic_career: string | null;
  major: string | null;
  writeup: string | null;
  picture_url: string | null;
  notable_achievements: string | null;
  interests_hobbies: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
}

// Represents a student entry after initial processing from CSV/form, ready for storage or final JSON structuring
export interface ProcessedStudentEntry extends StudentProfile {
  student_id: string;         // e.g., john-doe
  academic_year_key: string;  // e.g., ay21-22
  major_abbreviation_key: string; // e.g., BME, MS

  // Optional raw fields for reference or further processing
  raw_course_name?: string;
  raw_masters_course?: string;
  raw_intake_batch?: string;
  email?: string;
}

export interface FinalJsonOutput {
  [academicYear: string]: {
    [majorAbbreviation: string]: {
      [studentId: string]: StudentProfile;
    };
  };
}

export const generateStudentId = (fullName: string): string => {
  if (!fullName) return `unknown-student-${Date.now()}`;
  return fullName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .trim() || `unknown-student-${Date.now()}`;
};

export const parseAcademicYearKey = (intakeBatch: string): string => {
  if (!intakeBatch) return 'unknown-ay';
  const match = intakeBatch.match(/AY(\d{2})\/(\d{2})/i);
  if (match && match[1] && match[2]) {
    return `ay${match[1]}-${match[2]}`;
  }
  return 'unknown-ay';
};

export const getMajorAbbreviation = (courseName?: string, mastersCourse?: string): string => {
  const lowerCourseName = courseName?.toLowerCase() || '';

  if (mastersCourse || lowerCourseName.includes('master')) return 'MS'; // Check for Masters

  const mappings: { [key: string]: string } = {
    'biomedical engineering': 'BME',
    'computer engineering': 'CEG',
    'chemical engineering': 'CHBE',
    'electrical engineering': 'EEE',
    'environmental engineering': 'EVE',
    'materials science and engineering': 'MLE',
    'materials science engineering': 'MLE',
    'mechanical engineering': 'MPE',
    'engineering science programme': 'ESP',
    'engineering science': 'ESP',
    'industrial and systems engineering': 'ISE',
    'industrial design': 'DS',
    'civil engineering': 'CVE', // As per CSV, though not in user's initial JSON example. Adjust if needed.
                                // The user's provided JSON structure does not include CVE.
                                // For strict adherence to the provided JSON, this might need to be 'UNKNOWN' or handled.
                                // Let's assume for now we only map to keys present in the target JSON structure.
                                // Re-evaluating: The target JSON structure is key. If CVE is not a key there, map to UNKNOWN or specific handling.
                                // The provided database.json does not have CVE. So, this mapping should be reconsidered or made UNKNOWN.
                                // For now, I will keep it and you can remove if CVE is not a valid major key in your final JSON.
                                // Based on the user's JSON, 'CVE' is not present. Let's only map known ones.
  };
   if (lowerCourseName.includes('biomedical engineering')) return 'BME';
   if (lowerCourseName.includes('computer engineering')) return 'CEG';
   if (lowerCourseName.includes('chemical engineering')) return 'CHBE';
   if (lowerCourseName.includes('electrical engineering')) return 'EEE';
   if (lowerCourseName.includes('environmental engineering')) return 'EVE';
   if (lowerCourseName.includes('materials science')) return 'MLE';
   if (lowerCourseName.includes('mechanical engineering')) return 'MPE';
   if (lowerCourseName.includes('engineering science')) return 'ESP';
   if (lowerCourseName.includes('industrial and systems engineering')) return 'ISE';
   if (lowerCourseName.includes('industrial design')) return 'DS';


  return 'UNKNOWN'; // Fallback for unmapped courses
};

export const getAcademicCareer = (majorAbbreviation: string): string => {
  if (majorAbbreviation === 'MS') return 'E-Scholars Graduate';
  if (majorAbbreviation === 'DS') return 'D-Scholars';
  if (majorAbbreviation === 'UNKNOWN') return 'Unknown Academic Career';
  return 'E-Scholars Undergraduate';
};

export const getMajorDisplay = (courseName: string | undefined, majorAbbreviation: string): string | null => {
  if (majorAbbreviation === 'MS' || majorAbbreviation === 'DS' || majorAbbreviation === 'UNKNOWN') return null;
  return courseName || null;
};

// Transforms a flat list of processed student entries into the nested JSON structure
export const structureDataForJson = (students: ProcessedStudentEntry[]): FinalJsonOutput => {
  const output: FinalJsonOutput = {};
  students.forEach(student => {
    const { academic_year_key, major_abbreviation_key, student_id, ...profileData } = student;

    // Remove internal processing keys from the final profile
    const finalProfile: StudentProfile = {
        name: profileData.name,
        admit_year: profileData.admit_year,
        academic_career: profileData.academic_career,
        major: profileData.major,
        writeup: profileData.writeup,
        picture_url: profileData.picture_url,
        notable_achievements: profileData.notable_achievements,
        interests_hobbies: profileData.interests_hobbies,
        linkedin_url: profileData.linkedin_url,
        instagram_url: profileData.instagram_url,
        github_url: profileData.github_url,
    };

    if (!output[academic_year_key]) {
      output[academic_year_key] = {};
    }
    if (!output[academic_year_key][major_abbreviation_key]) {
      output[academic_year_key][major_abbreviation_key] = {};
    }
    output[academic_year_key][major_abbreviation_key][student_id] = finalProfile;
  });
  return output;
};

// CSV Header mapping - adjust keys to be more JS-friendly if needed during parsing
// These are the exact headers from the user's XLSX example.
export const CSV_HEADERS = {
  FULL_NAME: "Full name (as per NRIC)",
  COURSE: "What course are you from?",
  MASTERS_COURSE: "If you are doing Masters, what is your masters course?",
  DDP_MINOR: "If you are taking any DDP, Double Major or Minor, please specify: (eg. DDP with Business Administration) \u00A0", // \u00A0 is non-breaking space
  INTAKE_BATCH: "Which intake batch are you from?",
  EXPERIENCE: "(If applicable) Where did you go (or will be going) for SEP/summer/winter (school), NOC (location and company), internships (company)",
  WRITEUP: "Self write-up (e.g. Yuxuan's self write-up below). It'll be publicly available so you can also use it as a personal showcase page! (Limit: 200 words)",
  PICTURE_URL: "Upload a picture of yourself! Example on the right",
  NOTABLE_ACHIEVEMENTS: "Notable Achievements (if any, up to 3!) Example on the right",
  INTERESTS_HOBBIES: "Any interests/hobbies? (Up to 3!) Example on the right",
  LINKEDIN_URL: "LinkedIn Link (if any)",
  PERSONAL_EMAIL: "Personal Email",
  INSTAGRAM_URL: "Instagram Link (if any)",
  GITHUB_URL: "Github Link (if any)" // Assuming this header might exist for Github URL
};

export const mapCsvRowToProcessedStudent = (row: any): ProcessedStudentEntry => {
    const fullName = row[CSV_HEADERS.FULL_NAME]?.trim() || null;
    const courseRaw = row[CSV_HEADERS.COURSE]?.trim() || undefined;
    const mastersCourseRaw = row[CSV_HEADERS.MASTERS_COURSE]?.trim() || undefined;
    const intakeBatchRaw = row[CSV_HEADERS.INTAKE_BATCH]?.trim() || null;

    const student_id = generateStudentId(fullName!);
    const academic_year_key = parseAcademicYearKey(intakeBatchRaw!);
    const major_abbreviation_key = getMajorAbbreviation(courseRaw, mastersCourseRaw);
    const academic_career = getAcademicCareer(major_abbreviation_key);
    const major = getMajorDisplay(courseRaw, major_abbreviation_key);

    return {
        student_id,
        academic_year_key,
        major_abbreviation_key,
        name: fullName,
        admit_year: intakeBatchRaw, // Using the raw intake batch string as per JSON examples
        academic_career,
        major,
        writeup: row[CSV_HEADERS.WRITEUP]?.trim() || null,
        picture_url: row[CSV_HEADERS.PICTURE_URL]?.trim() || null,
        notable_achievements: row[CSV_HEADERS.NOTABLE_ACHIEVEMENTS]?.trim() || null,
        interests_hobbies: row[CSV_HEADERS.INTERESTS_HOBBIES]?.trim() || null,
        linkedin_url: row[CSV_HEADERS.LINKEDIN_URL]?.trim() || null,
        instagram_url: row[CSV_HEADERS.INSTAGRAM_URL]?.trim() || null,
        github_url: row[CSV_HEADERS.GITHUB_URL]?.trim() || row['github_url']?.trim() || null, // Check for alternative github header
        raw_course_name: courseRaw,
        raw_masters_course: mastersCourseRaw,
        raw_intake_batch: intakeBatchRaw,
        email: row[CSV_HEADERS.PERSONAL_EMAIL]?.trim() || null,
        // Store other raw fields if needed for Supabase 'original-census' or 'cleaned-census'
        raw_ddp_minor: row[CSV_HEADERS.DDP_MINOR]?.trim() || null,
        raw_experience_places: row[CSV_HEADERS.EXPERIENCE]?.trim() || null,
    };
};
