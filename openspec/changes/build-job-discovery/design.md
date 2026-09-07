## Context

The platform must make real roles easy to compare through clear metadata and dependable search behavior. This milestone depends on M02. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Build public job search, filtering, sorting, pagination and role details.
- Build company context pages and authenticated saved jobs.
- Distinguish approved native roles, external source listings, closed roles and unknown compensation.

**Non-Goals:** AI matching percentages, paid ranking, unpermitted scraping or implied employer partnerships.

## Decisions

- Keep URL query state for searches and filters so back navigation and sharing work.
- Use the chosen list/detail composition; adapt filters and detail panels intentionally on mobile.
- Preserve source, application mode, salary currency/period and moderation state as explicit data.

## Risks / Trade-offs

- Demo companies look like real customers; label sample content and isolate fixtures.
- Salary comparisons mislead; display currency/period and keep unknown values explicit.

## Migration Plan

Inspect existing behavior in backend jobs/companies APIs, frontend job discovery/detail/company screens before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Resolve implementation details against the existing repository when the milestone starts. The selected visual language and actual validation evidence remain prerequisites.

