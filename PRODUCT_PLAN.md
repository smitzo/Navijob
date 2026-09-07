# NaviJob product plan

Updated: 26 October 2026. Status: proposed first-release scope; B / Open Road with B1 / Sage & Forest selected; implementation authorized.

## Product decision

Build a real recruitment and job application website with reusable candidate profiles, project evidence, useful job discovery, straightforward applications, and a recruiter workspace. The first release is a small curated hiring platform. AI agents, autonomous applications and external-site autofill are deferred add-ons.

This is the current delivery plan. [FOUNDER_PLAYBOOK.md](FOUNDER_PLAYBOOK.md) preserves the earlier research, assumptions and commercial experiments; its application-assistant sequence is superseded by the current scope below.

The first market hypothesis is software engineering roles in India. Python/backend can be the first pilot segment; the data model and navigation should not exclude other engineering roles. A purchased domain, demo data or a visually polished mockup does not establish a live talent pool or employer partnership.

## First-release outcome

A candidate can create a profile once, save up to four resumes, describe projects, find a suitable role, review the exact information being sent and apply to a participating employer. A checked recruiter can publish an approved role, review the resulting applications and keep candidates informed through simple status changes. Operators can review listings and resolve reports.

One profile removes repeated entry inside NaviJob. External application links remain clearly marked; filling unrelated employer websites requires a separate future integration.

## People and permissions

| Person | Primary tasks | Boundary |
| --- | --- | --- |
| Visitor | Browse jobs, role details and company pages | Cannot access private candidate or recruiter data |
| Candidate | Maintain career information, resumes, projects, saved jobs and applications | Own private workspace; public profile is optional |
| Recruiter | Manage company roles and review applications | Access limited to authorized company and submitted candidate snapshots |
| Operator | Review employers, listings, public-profile requests and reports | Explicit privileged role, with an audit record |

Private candidate accounts can be open to verified-email signups. Reviewed public discovery can be invite/approval based. Invite-only access must correspond to a clear review process; it is not evidence of skill or employer interest.

## Release features

| Area | Include in first release | Acceptance signal |
| --- | --- | --- |
| Accounts | Real signup/login, email confirmation, recovery, candidate/recruiter roles | Server enforces access; demo login cannot authorize production data |
| Career profile | Experience, education, skills, location, work preferences and availability | Saved once, editable, recoverable after validation errors |
| Resumes | Up to four private uploads, named versions, primary choice, preview/download | File ownership and attachment access are enforced |
| Projects | Structured contribution, maturity, stack and optional source/demo links | Claims remain candidate supplied unless a specific check is recorded |
| Jobs | Search, useful filters, sorting, pagination, saved jobs and readable details | URL state is shareable; loading, no-results and failure states work |
| Companies | Identity, size/stage where known, work context, roles and posting source | Unknown information stays unknown; no fabricated endorsements |
| Applications | Native apply with profile, resume choice, job questions, review and receipt | Immutable submitted snapshot; duplicate submissions are prevented |
| Candidate tracking | Submitted/review/interview/offer/hired/rejected/withdrawn states | Candidate sees permitted states without recruiter private notes |
| Recruiter workspace | Company setup, draft roles, publication review and applicant review | Company boundaries and status transitions are enforced |
| Trust operations | Employer/listing moderation, scoped evidence labels and reports | Unreviewed content cannot imply approval; operators have audit history |
| Preferences and privacy | Public visibility choice, export and deletion request flow | Clear consequences for submitted employer copies |
| Product quality | Responsive layouts, keyboard use, error recovery and useful empty states | Full candidate and recruiter journeys verified before pilot |

Optional GitHub URLs belong in project evidence. OAuth connection and deeper evidence review can follow the core profile if they are useful; connecting an account must never be labeled universal skill verification.

## Deliberately deferred

- AI agents, automatic external applications, email inbox access and CAPTCHA handling.
- AI matching percentages, paid applicant ranking and unsupported hiring guarantees.
- AI resume writing and advanced paid customization until basic profiles and applications work.
- Broad public candidate search, unsolicited recruiter outreach and full social networking.
- Subscription checkout, payments and employer billing automation until the service and price are validated. Free pilot access can be managed manually.
- A universal ATS integration, enterprise SSO, complex assessments and video interviews.

The limits/prices in the founder playbook remain test hypotheses, not active product entitlements or committed commercial terms.

## Candidate journey

1. Browse a role without an account and understand compensation, work mode, requirements and application destination.
2. Create an account when saving or applying; return to the intended role after login.
3. Enter/import supported information, review it and save the career profile.
4. Add a resume version and optional project evidence.
5. Select Apply, confirm the resume, answer only job-specific questions and review the disclosure.
6. Receive a clear native application receipt and track its permitted status.
7. Return for another application with existing information already available.

For an external role, show the official destination and distinguish a saved/self-reported tracking record from an observed employer submission.

## Recruiter journey

1. Create a recruiter account and provide company identity and hiring contact information.
2. Operator checks the declared relationship; account role alone does not establish company authority.
3. Draft a structured role, including clear application mode and any known compensation.
4. Submit the role for moderation, resolve feedback and publish when approved.
5. Review applications and their attached snapshots; record private notes separately.
6. Change stages through allowed transitions, close the role and preserve application history.

## Interface requirements

The user explicitly prioritizes visual quality, rejected the original three concepts, and then selected round 02 B / Open Road for refinement. Follow [the design brief](designs/DESIGN_BRIEF.md) and [the gallery study](designs/round-02/REFERENCES.md); compare [B's colour variants](designs/b-colours/README.md) while preserving its composition and typography. Record the final palette and screen decisions before implementation.

Design real jobs and application screens first. A polished landing page is insufficient. Desktop discovery, job detail, profile editing, apply review, candidate tracking and recruiter applicant review all need consistent typography, spacing, states and mobile behavior.

## Architecture and existing code

Reuse Next.js/React/TypeScript/Tailwind and Django/DRF with Postgres/Supabase. Existing models, APIs and preview components are a starting point, not validated production functionality. Inspect each milestone's affected areas before changing code.

Production work must distinguish demo sessions from real authentication, enforce ownership on the server, protect resume downloads, and separate native applications from external tracking. An internal `submitted` database value is not proof of submission to another system.

## Delivery order and evidence

The canonical milestone status is [openspec/BOARD.md](openspec/BOARD.md). Each milestone has a native OpenSpec proposal, design, scenario specification and tasks. Planning artifacts can be complete while implementation remains Todo.

| Milestone | Result | Dependency |
| --- | --- | --- |
| M00 | Feature plan, OpenSpec workflow and prototype options | Existing repository |
| M01 | B / Open Road, selected palette and detailed screen design | M00; green selected, screens refined during implementation |
| M02 | Design system, navigation and real account foundation | M01 |
| M03 | Reusable career profile, four resumes and projects | M02 |
| M04 | Jobs, company pages and saved discovery | M02 |
| M05 | Native apply, immutable snapshots and candidate tracking | M03 + M04 |
| M06 | Recruiter role management and application review | M04 + M05 |
| M07 | Moderation, privacy controls and release-quality review | M03 + M05 + M06 |
| M08 | Small candidate/employer pilot and recorded findings | M07 |

Authorization, file access and role boundaries start in M02 and are checked throughout; M07 adds operational review and the final release gate rather than postponing security until the end.

No calendar promise is implied. Work one reviewable milestone at a time; revise estimates after the first implementation. Implementation is authorized under the [55-commit delivery plan](openspec/COMMIT_PLAN.md).

## Definition of done

- Relevant OpenSpec tasks are checked against actual behavior and linked evidence.
- Acceptance scenarios, permissions and important recovery paths have been verified.
- The chosen design is implemented coherently at desktop and mobile sizes.
- Labels distinguish demo, candidate claims, company checks and real confirmations.
- Focused project checks pass; failures and limitations are recorded honestly.
- The milestone board reflects delivery status, not merely artifact existence.

## Open decisions

- Detailed product screens will follow B / Open Road with B1 / Sage & Forest.
- Which early employers and candidate segment will participate in the pilot?
- Which real authentication integration best fits the existing stack and deployment?
- Which supported resume formats and size limits are practical after parser/storage review?
- Which notification channel is needed beyond in-product status for the first pilot?

These decisions do not justify choosing the user's preferred visual direction on their behalf.
