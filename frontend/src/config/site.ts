export const siteConfig = {
  name: "Navijob",
  tagline: "Navigate your next career move.",
  description:
    "Find verified fresher jobs, build an ATS-friendly resume, and get early job alerts.",
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
    "Fresher jobs",
    "Internships",
    "Resume builder",
    "ATS resume check",
    "Premium job alerts"
  ]
};
