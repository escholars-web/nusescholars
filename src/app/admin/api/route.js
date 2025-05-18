import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import Papa from "papaparse";
import { IncomingForm } from 'formidable-serverless'; // Or 'formidable' if not in serverless
import fs from 'fs'; // Only if formidable writes to disk temporarily

// IMPORTANT: Use Service Role Key for backend operations that need to bypass RLS
// or perform admin-level tasks. Store this securely in environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is missing for API route.");
  // Avoid throwing here during module load, handle in request if necessary
}
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export const config = {
  api: {
    bodyParser: false, // Required for formidable to parse the request
  },
};

// Placeholder for your data cleaning logic
// This function will need to be customized heavily based on your CSV and JSON structure
function cleanData(csvRow, existingProfilesMap) {
  // Example: Assuming CSV has 'id', 'name', 'email', 'year'
  // And your JSON needs 'scholarId', 'fullName', 'contactEmail', 'graduationYear'
  const scholarId = csvRow.id || csvRow.student_id; // Adjust column names

  if (!scholarId) {
    console.warn("Skipping row due to missing ID:", csvRow);
    return null; // Skip if no identifier
  }

  const cleanedProfile = {
    // Define your target JSON structure
    scholar_id: scholarId, // Ensure this matches your 'cleaned-census' primary key or unique identifier
    full_name: csvRow.name || `${csvRow.first_name} ${csvRow.last_name}`,
    email: csvRow.email,
    graduation_year: parseInt(csvRow.year, 10),
    // Add other fields and transformations
    // last_updated: new Date().toISOString(), // Good practice
  };

  // Check for duplicates/existing profiles (conceptual)
  // This logic depends on how you identify existing profiles.
  // The `existingProfilesMap` could be a Map of scholar_id -> profile from 'cleaned-census'
  if (existingProfilesMap && existingProfilesMap.has(scholarId)) {
    const existingProfile = existingProfilesMap.get(scholarId);
    // You might want to merge, update specific fields, or just mark as updated
    cleanedProfile.updated_at = new Date().toISOString(); // Example
    // Potentially merge data: { ...existingProfile, ...cleanedProfile }
    // Or only update if new data is different/more recent
  } else {
    cleanedProfile.created_at = new Date().toISOString(); // Example
  }

  // Add any other validation or transformation logic
  if (!cleanedProfile.email || !cleanedProfile.email.includes('@')) {
      console.warn(`Invalid or missing email for scholar ID ${scholarId}, skipping or marking as incomplete.`);
      // return null; // or handle as incomplete
  }

  return cleanedProfile;
}


export async function POST(req) {
  if (!supabaseAdmin) {
    return NextResponse.json({ message: "Supabase client not initialized for API route." }, { status: 500 });
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files.censusFile;
    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Read the CSV file content
    // formidable might save to a temporary path or provide a buffer
    const csvString = fs.readFileSync(file.path, "utf8"); // If file.path is available
    // If formidable provides a buffer directly, you might use that instead of fs.readFileSync

    // 1. (Optional but recommended) Upload raw CSV to Supabase Storage
    const rawFileName = `census-uploads/original-${Date.now()}-${file.name}`;
    const { error: storageError } = await supabaseAdmin.storage
      .from("census-files") // Ensure this bucket exists and has appropriate policies
      .upload(rawFileName, fs.createReadStream(file.path), { // Or pass the buffer/string
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error("Error uploading raw CSV to Supabase Storage:", storageError);
      // Decide if this is a critical error or if you can proceed
    }

    // Parse CSV data
    const parseResult = Papa.parse(csvString, {
      header: true, // Assumes first row is header
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numbers, booleans
    });

    if (parseResult.errors.length > 0) {
      console.error("CSV Parsing errors:", parseResult.errors);
      return NextResponse.json({ message: "Error parsing CSV file.", errors: parseResult.errors }, { status: 400 });
    }

    const originalData = parseResult.data;

    // 2a. Upload a copy to "original-census"
    // Assuming 'original-census' can store raw rows or a structured version of the CSV row.
    // It's often good to add a batch_id or upload_timestamp to group these records.
    const uploadTimestamp = new Date().toISOString();
    const originalCensusRecords = originalData.map(row => ({
        ...row, // Spread the original CSV row
        uploaded_at: uploadTimestamp,
        // source_file_name: rawFileName // Link to the stored file
    }));

    const { error: originalInsertError } = await supabaseAdmin
      .from("original-census")
      .insert(originalCensusRecords);

    if (originalInsertError) {
      console.error("Error inserting into original-census:", originalInsertError);
      return NextResponse.json({ message: `Error saving original census data: ${originalInsertError.message}` }, { status: 500 });
    }

    // 2b. Clean the dataset and prepare for "cleaned-census"
    // Fetch existing profiles from "cleaned-census" to check for updates
    // This is a simplified example. For large datasets, more optimized diffing is needed.
    let existingCleanedProfiles = [];
    const { data: currentCleanedData, error: fetchError } = await supabaseAdmin
        .from("cleaned-census")
        .select("scholar_id, ...any_other_fields_for_comparison"); // Select fields needed for diffing

    if (fetchError) {
        console.warn("Could not fetch existing cleaned profiles for comparison:", fetchError);
        // Decide how to handle this: proceed without comparison or error out
    } else {
        existingCleanedProfiles = currentCleanedData;
    }
    const existingProfilesMap = new Map(existingCleanedProfiles.map(p => [p.scholar_id, p]));


    const cleanedCensusData = originalData
      .map(row => cleanData(row, existingProfilesMap)) // Pass the map to your cleaning function
      .filter(profile => profile !== null); // Remove any nulls (skipped rows)

    if (cleanedCensusData.length === 0 && originalData.length > 0) {
        return NextResponse.json({ message: "No valid data to process after cleaning." }, { status: 400 });
    }


    // Upsert into "cleaned-census"
    // `upsert` requires a `onConflict` constraint (usually the primary key or a unique column)
    // Ensure 'scholar_id' (or your chosen unique identifier) is set as a primary or unique key in 'cleaned-census'
    const { data: upsertedData, error: cleanedUpsertError } = await supabaseAdmin
      .from("cleaned-census")
      .upsert(cleanedCensusData, {
        onConflict: "scholar_id", // **IMPORTANT**: Replace 'scholar_id' with your actual unique constraint column
        // ignoreDuplicates: false, // Set to true if you only want to insert new and not update existing
      });

    if (cleanedUpsertError) {
      console.error("Error upserting into cleaned-census:", cleanedUpsertError);
      return NextResponse.json({ message: `Error saving cleaned census data: ${cleanedUpsertError.message}` }, { status: 500 });
    }

    // 3. Convert this dataset into JSON and return it to the frontend for download
    // For efficiency, you might want to re-fetch the entire 'cleaned-census' table
    // or just return the `upsertedData` if it's comprehensive enough.
    const { data: finalCleanedData, error: finalFetchError } = await supabaseAdmin
        .from("cleaned-census")
        .select("*"); // Or select specific columns

    if (finalFetchError) {
        console.error("Error fetching final cleaned data:", finalFetchError);
        return NextResponse.json({ message: "Data processed, but failed to fetch final dataset for download." }, { status: 500 });
    }


    return NextResponse.json({
      message: "Census processed successfully!",
      cleanedData: finalCleanedData, // This will be used for the JSON download
      // rawDataUploaded: originalData.length,
      // cleanedDataProcessed: cleanedCensusData.length,
      // upsertedCount: upsertedData ? upsertedData.length : 0
    }, { status: 200 });

  } catch (error) {
    console.error("API Error in upload-census:", error);
    // Check if error is from formidable (e.g., file size limit)
    if (error.httpCode) {
        return NextResponse.json({ message: error.message }, { status: error.httpCode });
    }
    return NextResponse.json({ message: error.message || "An unexpected server error occurred." }, { status: 500 });
  }
}
