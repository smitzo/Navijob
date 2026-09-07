## Context

Native applications should reuse candidate information while preserving exactly what was disclosed to an employer. This milestone depends on M03, M04. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Build resume selection, job-specific questions and an explicit review/submit flow.
- Store immutable application snapshots and prevent duplicates.
- Expose candidate application history and permitted status updates; identify external tracking separately.

**Non-Goals:** Submitting to external ATSs, AI-generated answers, employer ranking guarantees or exposing recruiter private notes.

## Decisions

- Create a submitted snapshot of resume, profile data and answers instead of letting later profile edits rewrite history.
- Use server-side duplicate/role-availability enforcement and safe repeated-submit handling.
- Treat externally saved/self-reported applications as a different confirmation source.

## Risks / Trade-offs

- Repeated requests create duplicates; enforce uniqueness and idempotent submission behavior.
- Later profile edits alter employer views; read submitted snapshots for historical review.

## Migration Plan

Inspect existing behavior in backend jobs/application models and APIs, candidate application review/tracking UI before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Resolve implementation details against the existing repository when the milestone starts. The selected visual language and actual validation evidence remain prerequisites.

