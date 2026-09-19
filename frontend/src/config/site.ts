export const siteConfig = {
  name: "Navijob",
  tagline: "Less paperwork. More possibilities.",
  description:
    "Create your career profile once, choose your resume and find your next role on NaviJob.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "hello@navijob.in"
};

export const waitlistOptions = {
  statuses: [
    "Student",
    "Fresher",
    "Looking for internship",
    "Early-career professional",
    "Switching career"
  ],
  interests: [
    "Premium startup jobs",
    "Internships",
    "Verified remote roles",
    "ATS resume check",
    "Recruiter access"
  ]
};
