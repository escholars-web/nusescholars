import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageTemplateProps {
  children: React.ReactNode; // Allows any React content to be passed as children
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[--background]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageTemplate;
