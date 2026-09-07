# NaviJob design brief

Status: B / Open Road selected for refinement; B1 / Sage & Forest selected. Updated: 26 October 2026.

## Design intent

NaviJob should feel like a credible recruitment product with an intentional visual identity. The user rejects the generic AI-generated SaaS appearance, especially arbitrary fonts, colour schemes and themes. Quality must come from typography, information hierarchy, page composition and usable workflows.

The product being designed is a jobs and applications website. AI agents are a deferred add-on and must not shape the initial navigation, headline, empty states or illustration language.

## Reference vocabulary

The user explicitly requested gallery-led inspiration after rejecting the original designs. The [round 02 study](round-02/REFERENCES.md) covers REDSOFA via Lapa Ninja, Parallel via Landingfolio and Frontify careers via Land-book. Actual gallery captures were inspected before proposing the new directions. Page Collective was inaccessible and is not claimed as inspected. B / Open Road, informed by Parallel, is now selected; the other examples remain exploration context.

Study composition, type proportions, photographic treatment, navigation and transitions into useful product content. Do not reduce the exercise to extracting a colour palette. The following recruitment references remain useful for information architecture, rather than defining the active art direction.

| Reference | Study | Do not copy or assume |
| --- | --- | --- |
| [Welcome to the Jungle](https://www.welcometothejungle.com/en) | Company context, editorial confidence and recruitment hierarchy | Branding, photography rights or functionality not inspected |
| [Wellfound jobs](https://wellfound.com/jobs) | Job metadata, discovery density and practical comparison | Community counts, endorsements or logo collections |
| [The Dots](https://the-dots.com/) | Professional identity and creative recruitment composition | Current pages blocked from automated inspection must be checked visually later |
| [Ashby](https://www.ashbyhq.com/) | Clear structured hiring information and functional workspace design | Private or uninspected product screens |
| [Working Not Working](https://workingnotworking.com/) | Confident directory identity and typography | An assertion that NaviJob shares its audience or network |

References guide craft. They do not authorize copying another site's assets or imply that a generated concept is an exact screenshot of an existing product.

## Three prototype options

Round 02 concepts show a designed public homepage with visible job browsing and the same fictional sample roles. They are bitmap design studies, not screenshots of implemented NaviJob behavior. The rejected round 01 files remain available only as history.

1. **Talent Collective:** bold coral recruitment identity, expressive grotesk typography, people photography and a ruled role list; informed by REDSOFA.
2. **Open Road:** approachable geometric typography, butter yellow, a wayfinding graphic, immediate search and outlined role cards; informed by Parallel.
3. **Human Perspective:** cool paper and ink, editorial serif headlines, documentary photography and a spacious role list; informed by Frontify careers.

The exact generated text, counts, company names and colour values are illustrative. Implementation will use reviewed content, real counts and accessible final tokens. No mockup establishes a verified employer or real vacancy.

## Selection and refinement

- Confirmed: user likes B / Open Road and requested different colours. Preserve its layout and typography for refinement.
- Compare [B's three colour variants](b-colours/README.md): Sage & Forest, Powder Blue & Navy, and Ivory & Rust. The user selected Sage & Forest; preserve the other variants as history.
- Record the selection, date, preferred elements and rejected elements in `designs/README.md`.
- Resolve the typefaces, font licensing, weights, spacing, palette and component states after the choice.
- Produce coherent desktop and mobile layouts for the key screens before broad UI implementation.
- Evaluate ordinary forms and tables, not only a hero section.

The direction and green palette are selected; detailed screens and final licensed font files remain to be implemented and reviewed. An assistant palette recommendation is not a selection.

## Typography

- Choose a primary functional typeface deliberately; avoid leaving the browser/default sans stack as the final identity.
- Editorial serif display type is an option, not an automatic design requirement.
- Shortlist accessible, licensed typefaces such as Source Sans 3 or IBM Plex Sans for functional text; confirm available weights and licensing before implementation.
- Use a consistent scale and realistic line lengths. Job titles, company, compensation and location must scan at a glance.
- Expressive large headlines are permitted when grounded in the selected reference and balanced with usable content. Avoid weak hierarchy, tiny gray metadata, excessive letter spacing and identical bold treatment everywhere.
- Keep salary values, dates, checkbox labels and validation messages readable on mobile.

## Colour, shape and spacing

- Choose a coherent reference-led brand palette and a separate semantic status palette. A bold brand field is permitted; it does not excuse unreadable job details.
- Use neutral surfaces, consistent dividers and a documented spacing system.
- Prefer flat surfaces and modest corner radii where the selected direction calls for them.
- Use shadows sparingly and for a purpose, such as a popover or overlay.
- Status must not rely on colour alone.

Exclude gradient backgrounds, purple glows, glassmorphism, decorative floating chips, excessive pill cards, generic bento marketing sections, AI sparkles and fabricated activity counters from the initial direction.

## Information architecture

| Area | Main screens | Information priority |
| --- | --- | --- |
| Public | Home/discovery, job detail, company profile | Role, company, compensation, location, work mode, experience, posting source |
| Candidate | Profile editor, resume versions, projects, saved jobs, apply review, applications, settings | Task completion, ownership, selected version and disclosure |
| Recruiter | Setup, job list/editor, applicant list, candidate snapshot and stages | Role context, readable evidence, permitted actions and response tracking |
| Operator | Review queue and reports | Evidence, scope of check, decision and audit history |

Navigation labels use everyday recruitment language. The user should not need to understand backend implementation to finish a task.

## Required screen states

Design and verify loading, empty, populated, validation error, network error, permission denied, expired session, saved, unsaved changes, closed role, already applied and withdrawn states where relevant. A screenshot containing only an ideal populated screen is not a finished UI specification.

## Responsive and accessible behavior

- Check narrow mobile, tablet and wide desktop layouts; document behavior around 360/390, 768 and 1440 pixels as review samples.
- Filters become an accessible drawer or compact panel on small screens; preserve selected filters and result context.
- Job detail remains readable without squeezing desktop columns onto mobile.
- Recruiter tables adapt without hiding the candidate identity or primary action.
- Forms have visible labels, keyboard focus, explanatory errors and logical tab order.
- Verify contrast against WCAG AA for final tokens; never infer compliance from a generated image.
- Respect reduced motion and use restrained transitions that support navigation or feedback.

## Design review rubric

Score each category from 1–5 during M01. A weak result in task clarity, readability or mobile behavior must be repaired even when the branding is attractive.

| Category | Review question |
| --- | --- |
| Identity | Does it feel deliberate and credible for recruitment? |
| Reference translation | Can the composition and type decisions be explained from inspected examples without copying them? |
| Typography | Are type choices, weights and line lengths coherent? |
| Task clarity | Can a person find, compare and apply to a job quickly? |
| Information density | Is useful role information visible without visual clutter? |
| Continuity | Do profile, forms, applications and recruiter screens belong to the same product? |
| Accessibility | Are contrast, focus, labels and errors usable? |
| Mobile quality | Is the small-screen composition designed rather than compressed? |
| Honesty | Are sample data, evidence checks and actual system status clear? |

## Implementation review artifacts

Before M02 UI work expands, keep the chosen visual tokens and representative screens linked from the M01 change. During implementation, compare browser captures of actual routes at the review widths and record focused fixes. Image concepts are not runtime or accessibility evidence.
