## Context

The repository has a Next.js frontend, Django backend, models, APIs and demo routes. The current request is a feature plan, OpenSpec milestones and three UI image concepts. The user explicitly defers AI agents and will choose the visual direction.

## Goals / Non-Goals

**Goals:** one current scope, comparable visual options, scenario-based milestones, honest task status and a usable archive workflow.

**Non-Goals:** implementation, production data changes, selecting the user's visual preference, installing global shortcuts, committing or deploying.

## Decisions

- Keep `PRODUCT_PLAN.md` as the scope decision and `openspec/BOARD.md` as the delivery index. Preserve the founder playbook as research history.
- Use the existing native `spec-driven` schema. Each future milestone has an independent capability specification and unchecked implementation tasks.
- Complete this documentation milestone separately from visual selection. M01 stays in Review until the user's preference is recorded and the remaining screen design is resolved.
- Generate three image studies of a shared job-discovery task. Store the images and exact prompts locally; use fictional data and a visible concept note.
- Keep the archive empty until a completed named change is actually archived. An empty archive is more accurate than treating an unbuilt feature as historical delivery.

## Risks / Trade-offs

- [OpenSpec says artifacts are complete] → Board and checkboxes distinguish plan readiness from delivered behavior.
- [Image text or counts look like live product data] → Label every asset illustrative; implement only reviewed content and real counters later.
- [Choosing a palette without user input] → Record all options as proposals and defer the choice.
- [Plans become stale] → Update board evidence and the relevant change at each milestone; use the latest user direction over older research suggestions.

## Migration Plan

Add planning and design artifacts without modifying runtime code or schemas. Keep the existing working tree intact. Archive only after the documentation scope has been checked and an archive action is appropriate.

## Open Questions

The user's visual preference and later pilot participants remain unresolved; neither is required to create the plan or present concept options.
