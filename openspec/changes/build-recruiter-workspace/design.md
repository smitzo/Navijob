## Context

Employers need an understandable workflow from creating a role to reviewing applications and keeping candidates informed. This milestone depends on M04, M05. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Build company setup and recruiter-authority requests.
- Provide role draft/edit, publication review and close/archive behavior.
- Build applicant lists, snapshot review, private notes and allowed stage transitions.

**Non-Goals:** Bulk unsolicited outreach, AI screening, external ATS replacement, enterprise SSO or automated billing.

## Decisions

- Company affiliation and checked authority are separate from a self-selected recruiter role.
- Use readable applicant lists and detail views; add drag-and-drop only if later observed usage requires it.
- Keep private notes, candidate-visible status and stage audit events separate.

## Risks / Trade-offs

- Cross-company data leak; apply company membership checks to every private read/write.
- Unreviewed job publishes directly; enforce a moderation/publication transition on the backend.

## Migration Plan

Inspect existing behavior in backend companies/recruiters/jobs permissions, recruiter setup/job/applicant UI before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Resolve implementation details against the existing repository when the milestone starts. The selected visual language and actual validation evidence remain prerequisites.

