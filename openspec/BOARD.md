# NaviJob milestone board

Updated: 26 October 2026. Green implementation is authorized under the [55-commit plan](COMMIT_PLAN.md).

Read [the product plan](../PRODUCT_PLAN.md), [the visual choices](../designs/README.md) and [the workflow](README.md). Proposal/spec/design files being complete means a milestone is planned; task completion and recorded acceptance evidence determine delivery status.

## Current focus

**Selected: B / Open Road with B1 / Sage & Forest.** The user likes B and requested different colours. Compare [three colour variations](../designs/b-colours/README.md) while preserving its composition and typography. Round 01 remains rejected history; round 02 A and C remain unselected alternatives. AI agents and external-site automation are add-ons outside the initial release.

View all images in [the local gallery](../assets/index.html). Image files live under assets/; prompts and design records remain in designs/.

Latest decision: B1 / Sage & Forest selected. The user authorized implementation and 50–60 meaningful commits at significant milestones. Detailed commit boundaries will be recorded before product code changes; live pilot recruitment remains dependent on real participants.

## Milestones

| ID | Milestone / OpenSpec change | State | Depends on | Acceptance / evidence |
| --- | --- | --- | --- | --- |
| M00 | [Establish the plan](changes/establish-navijob-plan/proposal.md) | Done | Existing project | Scope, local workflow, three prototypes and milestone artifacts created; strict validation passed for all nine changes and local artifact checks passed |
| M01 | [Choose visual direction](changes/choose-product-visual-direction/proposal.md) | Review | M00 + palette/screen review | B / Open Road and Sage & Forest selected; detailed screens and responsive implementation next |
| M02 | [Platform foundation](changes/build-platform-foundation/proposal.md) | Todo | M01 | Selected design system, navigation and real account/permission evidence |
| M03 | [Career profiles](changes/build-candidate-career-profiles/proposal.md) | Todo | M02 | Profile, four private resumes, projects and ownership checks |
| M04 | [Job discovery](changes/build-job-discovery/proposal.md) | Todo | M02 | Search/filter URL state, role/company pages, saved jobs and empty/closed states |
| M05 | [Native applications](changes/build-native-applications/proposal.md) | Todo | M03 + M04 | Reviewed application, immutable snapshot, duplicate prevention and tracking |
| M06 | [Recruiter workspace](changes/build-recruiter-workspace/proposal.md) | Todo | M04 + M05 | Company-scoped roles, applicant review, private notes and permitted stages |
| M07 | [Trust and readiness](changes/build-trust-and-pilot-readiness/proposal.md) | Todo | M03 + M05 + M06 | Moderation, scoped labels, privacy controls and verified release journeys |
| M08 | [Curated hiring pilot](changes/run-curated-hiring-pilot/proposal.md) | Todo | M07 + operational authorization | Real cohort, checked roles, consent, repeat use and honest outcome report |

M03 and M04 are separate work streams after M02, but no parallel-agent work is implied or requested. Permissions and private-data protection apply throughout; M07 is the final operational review rather than the first security pass.

## Backlog / add-ons

| Idea | State | Revisit when |
| --- | --- | --- |
| AI writing and deeper resume customization | Backlog | Profile/application workflow shows repeated use and paid demand |
| AI application agent | Backlog | Core product works, explicit scope exists and serving costs/reliability are measured |
| External-site autofill/ATS automation | Backlog | Native flow is useful and supported-site requirements are independently scoped |
| GitHub OAuth and deeper evidence checks | Backlog | Public links are insufficient and the needed check/permissions are clear |
| Candidate subscriptions and automated employer billing | Backlog | Actual paid pilot value and commercial terms are established |
| Broad talent directory, outreach or social features | Backlog | Opt-in supply and real employer demand justify expansion |
| Enterprise integrations and SSO | Backlog | A real customer requirement exists |

## Done

M00 is Done: documentation, local OpenSpec setup and concept generation are complete. No product implementation milestone is Done. Completing M00 does not establish implemented recruitment functionality.

## Archived

No changes have been archived yet. Archive completed named changes through OpenSpec only after task verification and appropriate spec synchronization. Historical archive paths belong here when they actually exist; do not create artificial completed-feature records.

## Acceptance evidence log

- 26 October 2026: existing project and contribution guidance inspected; runtime/demo distinction recorded.
- 26 October 2026: current user instruction excludes AI agents from the initial release.
- 26 October 2026: three UI concepts generated with the built-in image tool, visually inspected and saved with exact prompts; all PNGs passed file validation at 1536 × 1024 pixels.
- 26 October 2026: `openspec validate --all --strict --no-interactive --json` passed for all nine changes with zero issues.
- 26 October 2026: local references, Markdown fences, future unchecked implementation tasks and three PNGs were checked; tracked whitespace check passed. Application runtime tests were not required for this planning-only change and were not run.
- 26 October 2026: user rejected round 01 and requested Lapa Ninja, Landingfolio, Page Collective or Land-book inspiration. REDSOFA, Parallel and Frontify careers captures were inspected and attributed; Page Collective returned 403. Round 01 is retained as rejected history; M01 remains in Review.
- 26 October 2026: three round 02 concepts generated with the built-in image tool, inspected and saved with exact prompts, file metadata and checksums. They show original homepage compositions and sample job browsing. Image validity is separate from user approval and runtime evidence.
- 26 October 2026: user selected B / Open Road for refinement and requested different colours. Task 2.1 records the direction choice; final palette/tokens, detailed screens and M01 completion remain pending.
- 26 October 2026: all 12 images relocated into assets/ with unchanged checksums; the offline gallery, all document links, manifests and exact prompts passed checks. Strict validation passed for all nine OpenSpec changes.
- 26 October 2026: user selected green (B1 / Sage & Forest), authorized the next implementation steps and requested 50–60 meaningful commits.
- 26 October 2026: three colour edits of the original B image generated with the built-in image tool, visually inspected and saved under designs/b-colours/ with exact prompts, dimensions and checksums. Sage & Forest, Powder Blue & Navy, and Ivory & Rust remain proposed palettes; original B preserved. Requested solid colour pairs were calculated separately from image appearance; final UI states remain pending.

## Moving a milestone

1. Start from its proposal, scenario spec, design and task list.
2. Record actual implementation start before changing Todo to In progress.
3. Tick only verified tasks and link focused checks/screenshots.
4. Use Review when a concrete result or stated user decision is pending.
5. Move to Done after the scope and acceptance evidence are complete.
6. Archive with the native command and update this board with its real archive path.
