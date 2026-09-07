## Context

Existing demo routes and local demo sessions must become a consistent, access-controlled product foundation. This milestone depends on M01. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md and openspec/BOARD.md before implementation. Current work produces plans only.

## Goals / Non-Goals

**Goals:**

- Implement the selected visual tokens, layouts and reusable controls.
- Build real account, email confirmation and recovery journeys.
- Enforce candidate, recruiter and operator permissions on the server; separate demo data.

**Non-Goals:** AI features, external browser automation, job-marketplace scale, billing or deployment.

## Decisions

- Reuse the existing Next.js and Django foundation and select the account integration after auditing current session boundaries.
- Keep server authorization authoritative; a UI role selector or local demo session cannot grant production privileges.
- Build accessible shared forms, buttons and navigation around the selected direction.

## Risks / Trade-offs

- Demo identity leaks into real authorization; isolate demo routes and fixtures.
- Auth redirects lose the user's intended role; preserve safe internal return paths.

## Migration Plan

Inspect existing behavior in frontend app/layout/components, backend accounts/API authorization, authentication integration before editing. Implement in small reviewable tasks, preserve current data, and make any schema/data migration explicit. Verify the capability's acceptance scenarios and relevant failure paths. Record focused check results and representative UI evidence in the board before marking Done. Rollback must not discard existing candidate or employer data. Do not deploy during the current planning task.

## Open Questions

Real authentication integration requires a session/permission audit before implementation.

