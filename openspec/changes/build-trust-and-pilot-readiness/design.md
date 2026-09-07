## Context

A curated recruitment platform needs operational checks, transparent evidence labels and a verified first-release journey. This milestone depends on M03, M05, M06. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Build operator review for companies, roles and optional public profiles.
- Add reports, scoped verification labels, export/deletion request handling and audit history.
- Complete visual, accessibility and end-to-end readiness review with demo/live separation.

**Non-Goals:** Claiming certifications or universal candidate verification, enterprise scale, live launch or external outreach in the planning turn.

## Decisions

- Implement authorization continuously in earlier milestones and use this milestone for operational workflows and a final gate.
- Describe exactly what a badge checks and when it was checked.
- Make pilot readiness a documented review result; production publication remains a separate authorized action.

## Risks / Trade-offs

- Badges imply unsupported proof; publish scope and observation date.
- Deletion language overpromises control of employer copies; state retention consequences and review policy before launch.

## Migration Plan

Inspect existing behavior in operator/admin tools, account/file access, privacy/settings, cross-product release review before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Resolve implementation details against the existing repository when the milestone starts. The selected visual language and actual validation evidence remain prerequisites.

