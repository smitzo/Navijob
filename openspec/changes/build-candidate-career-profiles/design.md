## Context

Candidates need reusable career information and inspectable project context before applications can avoid repeated entry. This milestone depends on M02. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Build private career profile editing and useful completion guidance.
- Support four private resume uploads with clear named versions and a selected primary resume.
- Add project contribution, maturity, stack and optional evidence links; make public sharing an explicit choice.

**Non-Goals:** AI resume generation, opaque ATS scores, GitHub skill rankings or broad public recruiter search.

## Decisions

- Maintain confirmed candidate-entered facts and separate resume files from public sharing.
- Preserve the existing resume model as a starting point, then add only the lineage and access behavior required.
- Use explicit validation and clear unsaved-change recovery; optional parsing must be reviewed rather than silently trusted.

## Risks / Trade-offs

- Resume URLs become public; use authenticated or appropriately limited downloads.
- Different versions contradict employment facts; surface conflicts and require candidate resolution.

## Migration Plan

Inspect existing behavior in backend accounts/resumes, file storage, frontend profile/resume/project routes before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Resolve implementation details against the existing repository when the milestone starts. The selected visual language and actual validation evidence remain prerequisites.

