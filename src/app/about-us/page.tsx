"use client";

import React from "react";
import PageTemplate from "../../../components/PageTemplate";
import HeroSection from "../../../components/HeroSection";
import Section from "../../../components/AboutUsPage/Section";

const AboutUs: React.FC = () => {
  return (
    <PageTemplate>
      {/* Hero Section */}
      <HeroSection title="About Us" description="Learn more about us!" />

      {/* Introduction Section */}
      <Section
        title="Introduction"
        description="The Design and Engineering Scholars Programme is the premier scholarship programme of the NUS College of Design and Engineering, awarded to students who pair academic excellence with a strong co-curricular record and real leadership potential. D-Scholars read Architecture, Industrial Design or Landscape Architecture, and E-Scholars read any branch of engineering. The point of it is an enhanced educational experience that capitalises on both your academic abilities and your personal aspirations. Both scholarships are bond-free and cover full tuition, a living allowance, subsidised on-campus accommodation for two years, and a one-time computer allowance, and both are open to Singapore citizens presenting local qualifications."
        image="/images/about-us/beach.png"
      />

      {/* Academics Section */}
      <Section
        title="Academics"
        description="Scholars are enrolled in one of the College of Design and Engineering majors, and the graduation requirements are the same as for every other student in that major. E-Scholars follow an accelerated three year programme for their undergraduate degree, followed by the opportunity to pursue a Master’s degree in their fourth year. Alternatively, they may choose to pursue a four year Double Degree Programme. How the units are spread across those years differs slightly from major to major. D-Scholars reading Industrial Design or Landscape Architecture complete a four-year Bachelor’s degree, and those reading Architecture go on to a Master of Architecture after theirs. Scholars in both programmes are paired with a carefully selected pool of professors who provide close mentorship along the way."
        image="/images/about-us/talk.png"
        reverse
      />

      {/* Overseas Experience Section */}
      <Section
        title="Overseas Experience"
        description="The overseas experience is one of the key features of the programme. E-Scholars enjoy priority consideration for entry into both the Student Exchange Programme (SEP) and the NUS Overseas Colleges (NOC) programme, while D-Scholars enjoy priority consideration for SEP. Subsidies are available under the scholarship for overseas experiential programmes, Summer and Winter Exchange included, a perk on par with the NUS Global Merit Scholarship!"
        image="/images/about-us/travels.png"
      />

      {/* Community Section */}
      <Section
        title="D&E-Scholars Community"
        description="D&E-Scholars are guaranteed placement in one of the Residential Colleges on campus, excluding Acacia College, so you start university already living alongside people from every corner of NUS. Additionally, the D&E-Scholars Student Committee plans regular events such as town halls and bonding events, with welfare and good vibes, for scholars to get together and take a break for a while!"
        image="/images/about-us/orientation.jpg"
        reverse
      />
    </PageTemplate>
  );
};

export default AboutUs;
