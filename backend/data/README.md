# Backend Demo Data

This folder contains static JSON fixtures for demo-only experiences.

The files are intentionally plain JSON:

- `demo_companies.json`: 10 hiring startup companies.
- `demo_applicants.json`: 50 demo applicants across fullstack, AI, ML, frontend, backend, data, DevOps, product, and design roles.
- `demo_jobs.json`: demo job listings across full-time and internship roles, with fullstack, AI, and ML coverage.

These files are not production seed data and should not be treated as real users. Use them only when a demo mode needs read-only sample content.

Security notes:

- Do not place real personal data in these files.
- Do not expose write access to these files through public APIs.
- Treat all values as display data and escape them in frontend templates.
- Keep demo mode separate from authenticated production user data.
