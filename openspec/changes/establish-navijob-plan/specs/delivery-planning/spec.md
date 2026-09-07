## ADDED Requirements

### Requirement: Current product scope is explicit
The delivery documentation SHALL identify core recruitment functionality and deferred AI/automation add-ons separately.

#### Scenario: Contributor starts a milestone
- **WHEN** a contributor reads the product plan and milestone proposal
- **THEN** the first-release scope, dependencies and non-goals are visible without treating research hypotheses as shipped functionality

### Requirement: Delivery states require evidence
The milestone board SHALL distinguish planning artifacts, implementation progress, verified completion and archived history.

#### Scenario: Planning files exist for a future feature
- **WHEN** OpenSpec reports complete proposal, spec, design and tasks artifacts
- **THEN** the unimplemented feature remains Todo or Review as appropriate and implementation checkboxes remain unchecked

#### Scenario: An idea is deferred
- **WHEN** an add-on is excluded from the current release
- **THEN** it remains in the backlog and is not recorded as an archived completed feature

### Requirement: Visual choice remains with the user
The design workflow SHALL preserve three clearly identified image concepts and record no selected direction before explicit user feedback.

#### Scenario: Concepts are presented
- **WHEN** generated image options are available
- **THEN** their files, exact prompts and illustrative status are recorded and the visual-selection milestone remains open

### Requirement: Planning artifacts are locally reviewable
The project SHALL provide linked scope, design and OpenSpec documents that can be inspected without global slash-command configuration.

#### Scenario: Optional global shortcuts are unavailable
- **WHEN** the environment prevents installation of global Codex shortcuts
- **THEN** documented local CLI commands and project artifacts still support the planning workflow
