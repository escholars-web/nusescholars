"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageTemplate from "../../../components/PageTemplate";
import HeroSection from "../../../components/HeroSection";

const RESOURCE_URL =
  "https://sites.google.com/view/nus-e-scholars/home?authuser=0";

const Resources: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          window.location.href = RESOURCE_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <PageTemplate>
      <HeroSection title="Resources" />
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="text-lg leading-8 text-slate-600">
            This page will redirect you to the Engineering Scholars Programme
            Resource Page in{" "}
            <span className="font-bold text-nus-orange-700">{countdown}</span>{" "}
            seconds.
          </p>
          <a
            href={RESOURCE_URL}
            className="mt-6 inline-block rounded-lg bg-nus-orange-500 px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-nus-orange-600"
          >
            Take me there now
          </a>
          <p className="mt-6">
            <Link
              href="/"
              className="text-sm font-semibold text-nus-blue-600 underline-offset-4 hover:underline"
            >
              Go back to home
            </Link>
          </p>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Resources;
