import type { NextApiRequest, NextApiResponse } from 'next';
import { ProcessedStudentEntry, structureDataForJson, FinalJsonOutput, mapCsvRowToProcessedStudent, CSV_HEADERS, generateStudentId, parseAcademicYearKey, getMajorAbbreviation, getAcademicCareer, getMajorDisplay } from '../../../lib/dataUtils'; // Adjust path


// --- Mock Supabase Interaction (shared with upload-census for this demo) ---
// In a real scenario, these would interact with your Supabase database.
// This is a simplified in-memory store for demonstration.
// Replace with actual Supabase client calls.
let cleanedCensusDataStore: ProcessedStudentEntry[] = []; // This should be a shared store or DB

async function storeRawCsvLikeRecord(record: any) {
//   console.log("Storing raw-like record (conceptual):", record);
  // Supabase: client.from('original-census').upsert(record, { onConflict: 'some_unique_key_if_applicable' });
}

async function getCleanedCensusData(): Promise<ProcessedStudentEntry[]> {
  // Supabase: client.from('cleaned-census').select('*');
  return Promise.resolve([...cleanedCensusDataStore]);
}

async function upsertCleanedStudent(student: ProcessedStudentEntry) {
//   console.log("Upserting cleaned student (conceptual):", student.student_id);
  // Supabase: client.from('cleaned-census').upsert(student, { onConflict: 'student_id' });
  const index = cleanedCensusDataStore.findIndex(s => s.student_id === student.student_id && s.academic_year_key === student.academic_year_key && s.major_abbreviation_key === student.major_abbreviation_key);
  if (index > -1) {
    cleanedCensusDataStore[index] = student;
  } else {
    cleanedCensusDataStore.push(student);
  }
}
// --- End Mock Supabase Interaction ---


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Add authentication here
  // if (!isAdmin(req)) { return res.status(403).json({ message: 'Forbidden' }); }

  try {
    const profileDataFromForm = req.body; // This is the object from the form

    // Conceptual: Store raw-like record in 'original-census'
    // The form data is already somewhat structured, but you might want to log it or store it.
    await storeRawCsvLikeRecord(profileDataFromForm);

    // Transform form data into ProcessedStudentEntry
    // The form keys match CSV_HEADERS values
    const fullName = profileDataFromForm[CSV_HEADERS.FULL_NAME]?.trim() || null;
    const courseRaw = profileDataFromForm[CSV_HEADERS.COURSE]?.trim() || undefined;
    const mastersCourseRaw = profileDataFromForm[CSV_HEADERS.MASTERS_COURSE]?.trim() || undefined;
    const intakeBatchRaw = profileDataFromForm[CSV_HEADERS.INTAKE_BATCH]?.trim() || null;

    const student_id = generateStudentId(fullName!);
    const academic_year_key = parseAcademicYearKey(intakeBatchRaw!);
    const major_abbreviation_key = getMajorAbbreviation(courseRaw, mastersCourseRaw);
    const academic_career = getAcademicCareer(major_abbreviation_key);
    const major = getMajorDisplay(courseRaw, major_abbreviation_key);

    const processedStudent: ProcessedStudentEntry = {
        student_id,
        academic_year_key,
        major_abbreviation_key,
        name: fullName,
        admit_year: intakeBatchRaw,
        academic_career,
        major,
        writeup: profileDataFromForm[CSV_HEADERS.WRITEUP]?.trim() || null,
        picture_url: profileDataFromForm[CSV_HEADERS.PICTURE_URL]?.trim() || null,
        notable_achievements: profileDataFromForm[CSV_HEADERS.NOTABLE_ACHIEVEMENTS]?.trim() || null,
        interests_hobbies: profileDataFromForm[CSV_HEADERS.INTERESTS_HOBBIES]?.trim() || null,
        linkedin_url: profileDataFromForm[CSV_HEADERS.LINKEDIN_URL]?.trim() || null,
        instagram_url: profileDataFromForm[CSV_HEADERS.INSTAGRAM_URL]?.trim() || null,
        github_url: profileDataFromForm[CSV_HEADERS.GITHUB_URL]?.trim() || null,
        raw_course_name: courseRaw,
        raw_masters_course: mastersCourseRaw,
        raw_intake_batch: intakeBatchRaw,
        email: profileDataFromForm[CSV_HEADERS.PERSONAL_EMAIL]?.trim() || null,
        raw_ddp_minor: profileDataFromForm[CSV_HEADERS.DDP_MINOR]?.trim() || null,
        raw_experience_places: profileDataFromForm[CSV_HEADERS.EXPERIENCE]?.trim() || null,
    };

    // Conceptual: Upsert into 'cleaned-census'
    await upsertCleanedStudent(processedStudent);

    // Fetch all data from 'cleaned-census' (conceptual)
    const allCleanedData = await getCleanedCensusData();

    // Transform the complete cleaned data into the final JSON structure
    const finalJson = structureDataForJson(allCleanedData);

    res.status(200).json({
        message: `Profile for ${processedStudent.name} processed. Total ${allCleanedData.length} profiles in cleaned store.`,
        jsonData: finalJson
    });

  } catch (error: any) {
    console.error('API Error add-profile:', error);
    res.status(500).json({ message: 'Server error processing profile.', error: error.message });
  }
}
