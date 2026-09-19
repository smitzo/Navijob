# Sage / Open Road implementation

Selected: B layout with B1 / Sage & Forest. Palette: sage #E1ECDD, ink #19372E, forest #234B3C, accent #2C5947. White controls and restrained outlined cards preserve the selected mockup's structure.

Typography: self-hosted Manrope Variable from @fontsource-variable/manrope, SIL Open Font License. Functional text uses the same family with a deliberate weight hierarchy. No remote font request is required at runtime or during builds.

## Screen and state contract

| Screen | Layout and primary task | Recovery |
| --- | --- | --- |
| Home | Sage search-led hero, one-profile promise, outlined role previews | Explicit backend failure or genuine empty list |
| Jobs / company | URL search/filter toolbar, readable metadata and role list | Clear filters, retry, closed-role state |
| Role / apply | Role content with a bounded application summary and resume choice | Login return, validation errors, duplicate receipt |
| Candidate | Shared workspace navigation; profile, structured experience, education, projects and resume versions | Loading, own-data failures, saved feedback, empty lists |
| Applications | Status list, submission snapshot and withdrawal | Permission denial, immutable submitted content |
| Recruiter | Company onboarding, role list/editor and applicant review | Review status, denied company actions, empty stages |
| Account | Focused labeled forms and clear next actions | Expired token, invalid credentials, resend/recovery |

At narrow widths navigation collapses, cards stack and filters wrap without hiding their labels. Focus must remain visible. Check 390px and 1440px captures of implemented routes and real browser flows before release. Raster previews are stored in assets/; they are design references rather than a replacement for accessible semantic markup.
