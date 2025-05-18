import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable'; // Using formidable for file parsing
import fs from 'fs';
import Papa from 'papaparse';
import { ProcessedStudentEntry, structureDataForJson, mapCsvRowToProcessedStudent } from '../../../utils/dataUtils'; // Adjust path
import { supabase } from '../../../utils/supabaseClient';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
};

// --- Actual Supabase Interaction ---

/**
 * Stores a raw CSV row object into the 'original_census' table in Supabase.
 * @param row - The raw row object from CSV parsing.
 */
async function storeRawCsvRecordInSupabase(row: any) {
  // Ensure the row is an object, not an array, if PapaParse is configured differently.
  // Assuming `row` is an object where keys are CSV headers.
  const { data, error } = await supabase
    .from('original_census') // Ensure this table exists in Supabase
    .insert([row]); // Supabase insert expects an array of objects

  if (error) {
    console.error("Supabase error storing raw CSV row:", error);
    throw new Error(`Failed to store raw CSV record: ${error.message}`);
  }
  // console.log("Stored raw CSV row in Supabase:", data);
}

/**
 * Fetches all records from the 'cleaned_census' table in Supabase.
 * @returns A promise that resolves to an array of ProcessedStudentEntry.
 */
async function getCleanedCensusDataFromSupabase(): Promise<ProcessedStudentEntry[]> {
  const { data, error } = await supabase
    .from('cleaned_census') // Ensure this table exists
    .select('*');

  if (error) {
    console.error("Supabase error fetching cleaned census data:", error);
    throw new Error(`Failed to fetch cleaned census data: ${error.message}`);
  }
  return (data as ProcessedStudentEntry[]) || [];
}

/**
 * Upserts a processed student entry into the 'cleaned_census' table in Supabase.
 * It updates the record if a conflict occurs based on the specified columns, otherwise inserts a new record.
 * @param student - The ProcessedStudentEntry object.
 */
async function upsertCleanedStudentInSupabase(student: ProcessedStudentEntry) {
  // Define the columns that uniquely identify a student record for conflict resolution.
  // This should match your table's primary key or a unique constraint.
  // Using the composite key as implied by the previous mock logic.
  const conflictColumns = ['student_id', 'academic_year_key', 'major_abbreviation_key'];

  const { data, error } = await supabase
    .from('cleaned_census') // Ensure this table exists
    .upsert(student, {
      onConflict: conflictColumns.join(','), // Specify columns for conflict
      // ignoreDuplicates: false, // Default is false, meaning it will update on conflict.
                                  // Set to true if you only want to insert if not exists, and not update.
    });

  if (error) {
    console.error("Supabase error upserting cleaned student:", error);
    // More specific error handling might be needed depending on the type of error (e.g., constraint violation vs. network issue)
    throw new Error(`Failed to upsert cleaned student ${student.name || student.student_id}: ${error.message}`);
  }
  // console.log("Upserted cleaned student in Supabase:", data);
}
// --- End Actual Supabase Interaction ---


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // IMPORTANT: Add robust authentication here to protect the endpoint
  // Example: Check for an admin user session from Supabase Auth
  // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  // if (sessionError || !session /* || !isUserAdmin(session.user) */) { // Implement isUserAdmin
  //   return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  // }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const censusFile = files.censusFile?.[0];

    if (!censusFile) {
      return res.status(400).json({ message: 'No census file uploaded.' });
    }

    const fileContent = fs.readFileSync(censusFile.filepath, 'utf8');
    fs.unlinkSync(censusFile.filepath); // Clean up the uploaded file from the server's temp directory

    const parseResult = Papa.parse(fileContent, {
      header: true, // Crucial: ensures rows are objects, not arrays
      skipEmptyLines: true,
    });

    if (parseResult.errors.length > 0) {
        console.error("CSV Parsing Errors:", parseResult.errors);
        // Provide more detailed error feedback if possible
        const errorDetails = parseResult.errors.map(err => `Row ${err.row}: ${err.message} (Code: ${err.code})`).join('; ');
        return res.status(400).json({ message: `Error parsing CSV file. Details: ${errorDetails}`, errors: parseResult.errors });
    }

    if (!parseResult.data || parseResult.data.length === 0) {
        return res.status(400).json({ message: 'CSV file is empty or contains no data rows.' });
    }

    const newOrUpdatedStudentsCount = parseResult.data.length;

    for (const row of parseResult.data as any[]) {
      // Ensure row is not empty or just whitespace before processing
      if (Object.values(row).every(value => typeof value === 'string' && value.trim() === '')) {
        continue; // Skip effectively empty rows
      }

      // Store raw row in 'original_census'
      await storeRawCsvRecordInSupabase(row);

      const processedStudent = mapCsvRowToProcessedStudent(row);

      // Upsert into 'cleaned_census'
      await upsertCleanedStudentInSupabase(processedStudent);
    }

    // Fetch all data from 'cleaned_census' to build the final JSON
    const allCleanedData = await getCleanedCensusDataFromSupabase();

    // Transform the complete cleaned data into the final JSON structure
    const finalJson = structureDataForJson(allCleanedData);

    res.status(200).json({
        message: `${newOrUpdatedStudentsCount} profiles processed from CSV. Total ${allCleanedData.length} profiles in cleaned_census.`,
        jsonData: finalJson
    });

  } catch (error: any) {
    console.error('API Error /api/admin/upload-census:', error);
    // Determine if it's a known Supabase error or a general server error
    const errorMessage = error.message || 'An unexpected server error occurred.';
    res.status(500).json({ message: 'Server error processing file.', error: errorMessage });
  }
}
