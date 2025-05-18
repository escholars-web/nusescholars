import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable'; // Using formidable for file parsing
import fs from 'fs';
import Papa from 'papaparse';
import { ProcessedStudentEntry, structureDataForJson, FinalJsonOutput, mapCsvRowToProcessedStudent } from '../../../lib/dataUtils'; // Adjust path

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
};

// --- Mock Supabase Interaction ---
// In a real scenario, these would interact with your Supabase database.
// This is a simplified in-memory store for demonstration.
// Replace with actual Supabase client calls.
let cleanedCensusDataStore: ProcessedStudentEntry[] = [];

async function storeRawCsvRecord(row: any) {
  // console.log("Storing raw CSV row (conceptual):", row);
  // Supabase: client.from('original-census').insert(row);
}

async function getCleanedCensusData(): Promise<ProcessedStudentEntry[]> {
  // Supabase: client.from('cleaned-census').select('*');
  return Promise.resolve([...cleanedCensusDataStore]); // Return a copy
}

async function upsertCleanedStudent(student: ProcessedStudentEntry) {
  // console.log("Upserting cleaned student (conceptual):", student.student_id);
  // Supabase: client.from('cleaned-census').upsert(student, { onConflict: 'student_id' }); // Assuming student_id is unique
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

  // Add authentication here to protect the endpoint
  // if (!isAdmin(req)) { return res.status(403).json({ message: 'Forbidden' }); }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);

    const censusFile = files.censusFile?.[0];

    if (!censusFile) {
      return res.status(400).json({ message: 'No census file uploaded.' });
    }

    const fileContent = fs.readFileSync(censusFile.filepath, 'utf8');

    // Reset store for new upload for this demo. In reality, you'd merge or update.
    // cleanedCensusDataStore = [];

    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors.length > 0) {
        console.error("CSV Parsing Errors:", parseResult.errors);
        return res.status(400).json({ message: 'Error parsing CSV file.', errors: parseResult.errors });
    }

    const newOrUpdatedStudents: ProcessedStudentEntry[] = [];

    for (const row of parseResult.data as any[]) {
      // Conceptual: Store raw row in 'original-census'
      await storeRawCsvRecord(row);

      const processedStudent = mapCsvRowToProcessedStudent(row);

      // Conceptual: Upsert into 'cleaned-census'
      // This checks for duplicates based on student_id, ay_key, major_key and updates if exists, otherwise inserts.
      await upsertCleanedStudent(processedStudent);
      newOrUpdatedStudents.push(processedStudent);
    }

    // Fetch all data from 'cleaned-census' (conceptual)
    const allCleanedData = await getCleanedCensusData();

    // Transform the complete cleaned data into the final JSON structure
    const finalJson = structureDataForJson(allCleanedData);

    res.status(200).json({
        message: `${newOrUpdatedStudents.length} profiles processed from CSV. Total ${allCleanedData.length} profiles in cleaned store.`,
        jsonData: finalJson
    });

  } catch (error: any) {
    console.error('API Error upload-census:', error);
    res.status(500).json({ message: 'Server error processing file.', error: error.message });
  }
}
