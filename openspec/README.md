# NaviJob OpenSpec workflow

Start with [the product plan](../PRODUCT_PLAN.md), [the milestone board](BOARD.md) and [the visual options](../designs/README.md). The earlier [founder playbook](../FOUNDER_PLAYBOOK.md) is research context; the product plan records the latest scope.

OpenSpec CLI 1.6.0 was available when this workspace was initialized. The native `spec-driven` workflow is proposal → specs/design → tasks → implementation → verification → archive.

## Useful commands

Run from the NaviJob repository root:

```bash
openspec list
openspec status --change choose-product-visual-direction
openspec show choose-product-visual-direction
openspec validate --all --strict --no-interactive
openspec view
```

Each milestone change contains `proposal.md`, `design.md`, `tasks.md`, `.openspec.yaml` and scenario specifications in `specs/<capability>/spec.md`.

The CLI's artifact status means the planning files exist. It does not establish implemented or tested product behavior. The board records the actual delivery state, and task checkboxes need acceptance evidence.

In the installed CLI, `openspec list` labels an active change with a task file as `in-progress` even when it has `0/N` completed tasks. That is the CLI's broad active-change category, not evidence implementation started. Use the board's Todo/Review/Done states and the actual task counts for delivery tracking.

## Delivery states

| State | Meaning | Move forward when |
| --- | --- | --- |
| Backlog | Idea outside the current release | Scope and demand justify a new change |
| Todo | Planned milestone; implementation has not started | Dependencies are satisfied and implementation is requested |
| In progress | Work has actually started | Tasks and focused verification are completed |
| Review | A concrete result needs review or a stated decision | Feedback is resolved and acceptance evidence exists |
| Done | Scope is delivered and verified | A named completed change is ready for archive |
| Archived | Completed change stored by OpenSpec and relevant specs synchronized | Historical record; follow-up work gets a new change |

Blocked dependencies are recorded in the board; they do not turn unstarted work into an implementation result. Deferred or cancelled ideas stay in the backlog/decision log rather than being archived as completed features.

## Completing and archiving work

1. Verify the scenarios and tick only tasks actually completed.
2. Link focused check results and any accepted limitations from the board.
3. Run strict validation and inspect the named change's status.
4. Resolve the relevant spec synchronization and archive the completed change through OpenSpec:

```bash
openspec archive <completed-change-name> --yes
```

The archive updates canonical specs as appropriate and stores the change under `openspec/changes/archive/`. Do not manually move incomplete feature plans into the archive to make the board look finished.

## Local tooling note

Project-local OpenSpec skill files were generated under `.codex/skills/`. The initializer could not write optional global slash-command shortcuts into the environment's read-only Codex configuration. The project CLI and local planning files work without those global shortcuts. No global configuration workaround is required for this plan.
