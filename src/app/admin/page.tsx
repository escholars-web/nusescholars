"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { StudentProfile, ProcessedStudentEntry, CSV_HEADERS, mapCsvRowToProcessedStudent, generateStudentId, parseAcademicYearKey, getMajorAbbreviation, getAcademicCareer, getMajorDisplay } from '../../../utils/dataUtils';

const AdminPage = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [jsonData, setJsonData] = useState<any | null>(null);

  const [profileForm, setProfileForm] = useState<Record<string, string>>({
    [CSV_HEADERS.FULL_NAME]: '',
    [CSV_HEADERS.COURSE]: '',
    [CSV_HEADERS.MASTERS_COURSE]: '',
    [CSV_HEADERS.INTAKE_BATCH]: '',
    [CSV_HEADERS.WRITEUP]: '',
    [CSV_HEADERS.PICTURE_URL]: '',
    [CSV_HEADERS.NOTABLE_ACHIEVEMENTS]: '',
    [CSV_HEADERS.INTERESTS_HOBBIES]: '',
    [CSV_HEADERS.LINKEDIN_URL]: '',
    [CSV_HEADERS.INSTAGRAM_URL]: '',
    [CSV_HEADERS.GITHUB_URL]: '',
    [CSV_HEADERS.PERSONAL_EMAIL]: '',
    [CSV_HEADERS.DDP_MINOR]: '',
    [CSV_HEADERS.EXPERIENCE]: '',
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleUploadCensus = async (event: FormEvent) => {
    event.preventDefault();
    if (!csvFile) {
      setMessage('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('censusFile', csvFile);

    try {
      setMessage('Uploading and processing census data...');
      setJsonData(null);
      const response = await fetch('/api/admin/upload-census', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Census data processed successfully. ${result.message || ''}`);
        setJsonData(result.jsonData); // API returns the final JSON data
      } else {
        setMessage(`Error: ${result.message || 'Failed to process census data.'}`);
      }
    } catch (error) {
      console.error('Upload census error:', error);
      setMessage('An unexpected error occurred during census upload.');
    }
  };

  const handleProfileFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({
      ...profileForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddProfile = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setMessage('Adding/Updating profile...');
      setJsonData(null);
      const response = await fetch('/api/admin/add-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm), // Send form data as JSON
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Profile processed successfully. ${result.message || ''}`);
        setJsonData(result.jsonData); // API returns the final JSON data
        // Optionally clear form: setProfileForm({ ...initial empty state... })
      } else {
        setMessage(`Error: ${result.message || 'Failed to process profile.'}`);
      }
    } catch (error) {
      console.error('Add profile error:', error);
      setMessage('An unexpected error occurred while adding profile.');
    }
  };

  const handleDownloadJson = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'database.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('database.json downloaded.');
    } else {
      setMessage('No JSON data available to download. Process data first.');
    }
  };

  // Basic styling
  const styles = `
    .admin-container { max-width: 800px; margin: 2rem auto; padding: 2rem; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .admin-container h1, .admin-container h2 { color: #333; margin-bottom: 1rem; }
    .form-section { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    .form-group input[type="text"], .form-group input[type="email"], .form-group input[type="url"], .form-group textarea, .form-group input[type="file"] { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .form-group textarea { min-height: 100px; }
    .button { background-color: #0070f3; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-right: 0.5rem; }
    .button:hover { background-color: #005bb5; }
    .button-secondary { background-color: #666; }
    .button-secondary:hover { background-color: #444; }
    .message { margin-top: 1rem; padding: 1rem; border-radius: 4px; }
    .message.success { background-color: #e6fffa; border: 1px solid #b2f5ea; color: #234e52; }
    .message.error { background-color: #fff5f5; border: 1px solid #fed7d7; color: #c53030; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="admin-container">
        <h1>E-Scholars Admin Panel</h1>
        {message && <div className={`message ${jsonData ? 'success' : 'error'}`}>{message}</div>}

        <div className="form-section">
          <h2>Upload Census CSV</h2>
          <form onSubmit={handleUploadCensus}>
            <div className="form-group">
              <label htmlFor="csvFile">Census CSV File:</label>
              <input type="file" id="csvFile" accept=".csv" onChange={handleFileChange} required />
            </div>
            <button type="submit" className="button">Upload and Process CSV</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Add/Update Single Profile</h2>
          <form onSubmit={handleAddProfile}>
            {Object.entries(profileForm).map(([key, value]) => (
              <div className="form-group" key={key}>
                <label htmlFor={key}>{key}:</label>
                {key === CSV_HEADERS.WRITEUP ? (
                    <textarea id={key} name={key} value={value} onChange={handleProfileFormChange} />
                ) : (
                    <input type={key.includes("URL") || key.includes("Link") ? "url" : key.includes("Email") ? "email" : "text"} id={key} name={key} value={value} onChange={handleProfileFormChange} />
                )}
              </div>
            ))}
            <button type="submit" className="button">Add/Update Profile</button>
          </form>
        </div>

        {jsonData && (
          <div className="form-section">
            <h2>Download Processed Data</h2>
            <button onClick={handleDownloadJson} className="button button-secondary">Download database.json</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;
