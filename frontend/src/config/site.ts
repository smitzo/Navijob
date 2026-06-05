export const siteConfig = {
  name: "Navijob",
  tagline: "Premium startup jobs, launching soon.",
  description:
    "A curated hiring lane for ambitious candidates who want verified roles at high-signal startups.",
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
