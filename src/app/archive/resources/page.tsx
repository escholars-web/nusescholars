"use client";

import React, { useEffect, useState } from "react";
import PageTemplate from "@components/archive/PageTemplate";
import HeroSection from "@components/archive/HeroSection";

const Resources: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          window.location.href =
            "https://sites.google.com/view/nus-e-scholars/home?authuser=0";
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
      <div style={{ textAlign: "center", padding: "50px", fontSize: "24px" }}>
        <p>
          This page will redirect you to the Engineering Scholars Programme
          Resource Page in {countdown} seconds.
        </p>
        <p>
          If you want to go there immediately,{" "}
          <a
            href="https://sites.google.com/view/nus-e-scholars/home?authuser=0"
            style={{ textDecoration: "underline" }}
          >
            click here
          </a>
          .
        </p>
        <p style={{ marginTop: "20px" }}>
          <a href="/archive" style={{ textDecoration: "underline" }}>
            Go back to home
          </a>
        </p>
      </div>
    </PageTemplate>
  );
};

export default Resources;
