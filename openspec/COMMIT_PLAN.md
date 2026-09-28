# Green recruitment platform — commit plan

Authorized: 26 October 2026. Target: **55 meaningful commits**, within the user's requested 50–60 range. Starting revision: `659ef82`. Local commits are authorized; pushing, deployment and contacting employers are separate actions.

Direction: B / Open Road, B1 / Sage & Forest. Current source images live in assets/; design prompts and records live in designs/. Preserve previous designs as history. AI agents, external ATS automation, payments and paid applicant ranking remain deferred.

Each numbered item is a reviewable product or validation boundary. Run relevant checks before committing the phase; include backend rationale in UNDERSTANDING.md for backend features. Do not create empty or artificial commits to meet the count. Record concrete acceptance evidence in the relevant existing OpenSpec change. Feature implementation may expose follow-up fixes; keep the final count in the authorized range and document any changed boundaries.

## Ordered commit boundaries

- [x] 01. Record the selected green direction, asset gallery and delivery boundaries.
- [x] 02. Install licensed Manrope typography and define sage design tokens.
- [x] 03. Build accessible shared controls and feedback states.
- [x] 04. Build public navigation, footer and responsive menu.
- [x] 05. Build the green homepage hero and useful job search.
- [x] 06. Connect homepage role previews with honest loading and failure states.
- [x] 07. Build URL-driven discovery filters.
- [x] 08. Add discovery sorting, pagination and compensation formatting.
- [x] 09. Build public job detail with clear application destinations.
- [x] 10. Build public company context and open roles.
- [x] 11. Build the saved-jobs workspace.
- [x] 12. Add isolated backend test settings, health and CSRF bootstrap.
- [x] 13. Add validated registration and candidate/recruiter account roles.
- [x] 14. Add authenticated session login, logout and role boundaries.
- [x] 15. Add email confirmation and safe resend flow.
- [x] 16. Add expiring password recovery and reset.
- [x] 17. Connect the frontend API client and same-origin backend proxy.
- [ ] 18. Build real login and registration screens.
- [ ] 19. Build confirmation and password recovery screens.
- [ ] 20. Build authenticated candidate and recruiter workspace navigation.
- [ ] 21. Extend career profiles with structured experience and education.
- [ ] 22. Add owner-scoped profile API and validation.
- [ ] 23. Build the reusable career-profile editor.
- [ ] 24. Build experience editing with meaningful validation.
- [ ] 25. Build education editing with clear field states.
- [ ] 26. Add project evidence model and owner-scoped API.
- [ ] 27. Build the candidate project workspace.
- [ ] 28. Add private resume uploads with four-version limits.
- [ ] 29. Add protected resume retrieval, naming and primary selection.
- [ ] 30. Build resume upload and version-management screens.
- [ ] 31. Strengthen public job queries, deadlines and filter validation.
- [ ] 32. Add public company details with scoped trust labels.
- [ ] 33. Add saved-job persistence and connect the workspace.
- [ ] 34. Add immutable application snapshots and lifecycle fields.
- [ ] 35. Add native application review, validation and duplicate handling.
- [ ] 36. Build native apply review and submission receipt.
- [ ] 37. Add candidate application status and withdrawal actions.
- [ ] 38. Build candidate application tracking.
- [ ] 39. Add reviewed recruiter company onboarding.
- [ ] 40. Build recruiter onboarding screens.
- [ ] 41. Add company-scoped role drafts and publication review.
- [ ] 42. Build recruiter role editing and submission.
- [ ] 43. Build recruiter role dashboard and close actions.
- [ ] 44. Add company-scoped applicant review and private notes API.
- [ ] 45. Build recruiter applicant lists and filtering.
- [ ] 46. Add valid stage transitions and application history.
- [ ] 47. Build applicant detail, stage updates and private notes.
- [ ] 48. Add operator moderation and auditable review decisions.
- [ ] 49. Add candidate listing reports and operator handling.
- [ ] 50. Add privacy preferences and authenticated data export.
- [ ] 51. Add account-deletion requests and operator review.
- [ ] 52. Add in-product application updates and read status.
- [ ] 53. Add explicit local sample seeding and onboarding guidance.
- [ ] 54. Verify complete candidate/recruiter browser journeys and repair failures.
- [ ] 55. Complete release checks, accessibility review and honest handoff documentation.

## Validation approach

- Use a hermetic SQLite test settings module and isolated preview database; never migrate a configured remote database during local work.
- Check backend permissions, ownership, CSRF, immutable submissions, private resume access, recruiter company boundaries and moderation with focused integration tests.
- Check TypeScript, lint and production build for the frontend. Use real browser captures and end-to-end local candidate/recruiter journeys for the selected UI.
- Seed fictional sample data only through an explicit local command and label it. Do not infer employer partnerships, successful external submissions or real pilot traction.
- M08 remains pending until actual participants and recruitment authorization exist; code completion does not count as a real hiring pilot.

## Session and architecture decision

Reuse Next.js and Django/DRF. Django owns real authentication, server sessions, profiles, resume access, jobs and applications. Next.js proxies API requests to the backend under one origin; browser mutations carry CSRF tokens. Existing localStorage demo sessions cannot authorize real API access. Email confirmation/recovery use configured Django email delivery; local preview uses console mail. Resume files remain behind authenticated download endpoints.

