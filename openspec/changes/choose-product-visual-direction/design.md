## Context

The user rejected round 01 and requested gallery-led inspiration. This milestone depends on M00. Read PRODUCT_PLAN.md, designs/DESIGN_BRIEF.md, designs/round-02/REFERENCES.md and openspec/BOARD.md before implementation. The user now authorized green implementation; AI agents remain a deferred add-on.

The user subsequently selected B / Open Road for refinement and requested different colours. See designs/b-colours/README.md for the current palette study. Preserve B's composition and typography; do not reopen the direction choice or treat its original yellow as approved.

## Goals / Non-Goals

**Goals:**

- Inspect real gallery captures and use their composition and typography principles to produce three new homepage concepts with visible job browsing.
- Keep exact prompts, attributed sources, rejection history and review boundaries alongside the images.
- Record B as the selected direction and compare three colour-only variants while the palette remains open.
- Define typography, tokens, component states and desktop/mobile layouts for the main candidate and recruiter screens.

**Non-Goals:** Implement runtime UI, pick a concept without the user, or use image text and counts as live data.

## Decisions

- Use the same fictional roles and core profile/application promise so the directions can be compared fairly, while allowing materially different homepage compositions.
- Use REDSOFA via Lapa Ninja, Parallel via Landingfolio and Frontify careers via Land-book as the active visual references. Their captures were inspected; Page Collective was inaccessible. See the source record for exact versions and limitations.
- Change composition, type approach and image treatment, rather than only changing portal colours. A brand-led homepage must visibly connect to useful job discovery.
- Preserve round 01 as rejected history. Generate round 02 separately and require an explicit user choice before adopting a direction.
- B / Open Road is the user-selected direction. Keep its geometric typography, search-led hero, illustration, benefits strip and outlined cards while editing colours. Save palette images under assets/b-colours/ with the original B image in assets/round-02/ as the edit target; prompts and manifests stay in designs/b-colours/.
- Distinguish direction selection from palette approval: Sage & Forest, Powder Blue & Navy, and Ivory & Rust are proposals until the user chooses.
- Treat the images as visual studies; build functional, responsive screen layouts only after selection.
- Record font licensing and final token choices; do not infer accessibility from an image.
- Store image files under assets/ (b-colours/, round-02/, round-01/ and references/), leaving design documents, prompts and manifests in designs/. Provide assets/index.html as a local, dependency-free gallery; repair relative image links and verify unchanged file checksums after moving them.

## Risks / Trade-offs

- A visually attractive hero masks weak forms and tables; include profile, apply review and recruiter review screens.
- Images contain illustrative text/counts; replace them with reviewed content and actual product data during implementation.

## Migration Plan

No runtime or data migration is needed for this visual planning milestone. Preserve the source images and earlier rounds under assets/, keep prompts and notes in designs/, update the decision records, and verify image files, gallery references and local document links. Keep M01 in Review until the user chooses the palette and the remaining screen/state work is reviewed. Product implementation is now authorized under COMMIT_PLAN.md; deployment remains outside scope.

## Open Questions

B1 / Sage & Forest is selected. Final licensed font files and remaining screen designs are refined and checked during implementation.

