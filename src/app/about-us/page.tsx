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
        description="The DE-Scholars Programme is a premier programme designed to attract the very best students to read any branch of engineering at the National University of Singapore (NUS). Students with exceptional potential will be provided with an enhanced educational experience with the objective of capitalising on academic abilities and personal aspirations to train well-rounded leaders and innovators."
        image="/images/about-us/beach.png"
      />

      {/* Academics Section */}
      <Section
        title="Academics"
        description="Students admitted to the DE-Scholars programme are also enrolled in one of the Engineering Departments at NUS. The graduation requirements for DE-Scholars is the same as all other Engineering students in the chosen Department. Nevertheless, DE-Scholars will complete their B.Eng degree in 3 years. The distribution of modular credits across the 3 years is slightly different for each of the Departments. Starting from AY21/22, DE-Scholars can choose to complete a double degree or B.Eng in 4 years instead of going by the traditional 3 years B.Eng with a M.Sc in their 4th year."
        image="/images/about-us/talk.png"
        reverse
      />

      {/* Overseas Experience Section */}
      <Section
        title="Overseas Experience"
        description="The overseas experience is one of the key features of the DE-Scholars programme. DE-Scholars enjoy priority consideration for the Student Exchange Programme (SEP) and NUS Overseas College (NOC) programme, which are generously subsidised under the scholarship. Furthermore, DE-Scholars enjoy subsidised Summer and Winter Exchange programmes – a perk on par with the NUS Global Merit Scholarship!"
        image="/images/about-us/travels.png"
      />

      {/* Community Section */}
      <Section
        title="DE-Scholars Community"
        description="Most importantly, DE-Scholars enjoy the perk of staying at one of the University Town residences. In particular, they will have the choice between Residential College 4 and other colleges. Additionally, the DE-Scholars Committee plans regular events to cater to the welfare of the fellow scholars such as bonding events during recess and reading week, exam welfare, monthly townhall gathering with food and good vibes!"
        image="/images/about-us/formals.png"
        reverse
      />
    </PageTemplate>
  );
};

export default AboutUs;
