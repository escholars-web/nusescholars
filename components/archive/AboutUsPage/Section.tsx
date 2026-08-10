import React, { useState, useEffect } from "react";
import Image from "next/image";

interface SectionProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  image,
  reverse = false,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size and update state
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSmallScreen
          ? "column" // Stack vertically on small screens
          : reverse
            ? "row-reverse" // Reverse order on larger screens
            : "row", // Default side-by-side
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px 20px",
        gap: "20px",
      }}
    >
      <div style={styles.textContainer}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>{description}</p>
      </div>
      <div style={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={800}
          height={500}
          style={styles.image}
          placeholder="blur" // Optional: Use blur placeholder if available
          blurDataURL={image} // Optional: Provide a base64-encoded placeholder
        />
      </div>
    </div>
  );
};

const styles = {
  textContainer: {
    flex: 1,
    minWidth: "50%", // Occupies 50% when in row layout
    boxSizing: "border-box",
    padding: "10px 20px",
  } as React.CSSProperties,
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  } as React.CSSProperties,
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
    textAlign: "justify",
  } as React.CSSProperties,
  imageContainer: {
    flex: 1,
    minWidth: "50%", // Occupies 50% when in row layout
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  } as React.CSSProperties,
  image: {
    borderRadius: "8px",
    objectFit: "cover",
  } as React.CSSProperties,
};

export default Section;
