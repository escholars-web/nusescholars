"use client";

import React, { useState, useEffect } from "react";

const ConsentPopup: React.FC = () => {
  const [isConsentGiven, setIsConsentGiven] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("analyticsConsent");
    setIsConsentGiven(consent === "true");
  }, []);

  const handleConsent = () => {
    localStorage.setItem("analyticsConsent", "true");
    setIsConsentGiven(true);
  };

  if (isConsentGiven) {
    return null; // Do not show the popup if consent is already given.
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-nus-blue-900/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        <div className="h-1 w-12 rounded-full bg-nus-orange-500" />
        <h2
          id="consent-title"
          className="mt-4 text-xl font-bold text-nus-blue-600"
        >
          Analytics Notice
        </h2>
        <p id="consent-description" className="mt-3 leading-7 text-slate-600">
          This website uses analytics tools to improve your experience. By
          proceeding, you agree to allow us to collect data.
        </p>
        <button
          type="button"
          onClick={handleConsent}
          className="mt-6 w-full rounded-lg bg-nus-blue-600 py-3 font-bold text-white transition-colors duration-200 hover:bg-nus-blue-700"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default ConsentPopup;
