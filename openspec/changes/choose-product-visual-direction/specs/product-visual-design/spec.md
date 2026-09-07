## ADDED Requirements

### Requirement: Explicit visual selection
The design record SHALL identify the user-selected direction before it is treated as an implementation target.

#### Scenario: Images exist but no selection exists
- **WHEN** three image concepts have been delivered without a user choice
- **THEN** the selection remains pending and no concept is labeled approved

#### Scenario: User requests a combination
- **WHEN** the user identifies preferred elements from multiple concepts
- **THEN** the combined direction and its unresolved details are recorded before implementation

#### Scenario: Direction selected but palette unresolved
- **WHEN** the user selects a concept and requests different colours
- **THEN** the chosen composition and typography remain the refinement target, colour variants are proposed separately, and the palette remains pending until the user chooses

#### Scenario: User rejects a concept round
- **WHEN** the user rejects the delivered designs and requests a different inspiration approach
- **THEN** the rejected round remains labeled as history, the new reference-led round is recorded separately, and approval remains pending

### Requirement: Inspected gallery references
Each new concept round SHALL identify concrete gallery sources, record what was visually inspected and explain which principles are translated into the original NaviJob design.

#### Scenario: A gallery source is inaccessible
- **WHEN** a requested gallery or capture cannot be inspected
- **THEN** the source record identifies the limitation and does not describe its unseen design as inspected

#### Scenario: A new round is proposed
- **WHEN** replacement concepts are generated after rejection
- **THEN** they explore page composition and typography as well as palette, show useful job browsing, retain exact prompts and use illustrative content without implying real hiring activity

### Requirement: Accessible local image collection
Design images SHALL be stored under the project-root assets/ directory and be accessible through a local gallery without running the application.

#### Scenario: User opens the image gallery
- **WHEN** assets/index.html is opened in a browser
- **THEN** the current B colour options have labeled previews that link to full-size files, with prior concepts available separately

#### Scenario: Existing images are relocated
- **WHEN** images move from designs/ into assets/
- **THEN** their bytes remain unchanged, document and manifest references resolve to the new locations, and future design images follow the assets/ convention

### Requirement: Coherent product screen coverage
The design work SHALL cover discovery, role detail, profile editing, application review, application tracking and recruiter applicant review.

#### Scenario: Direction is selected
- **WHEN** the selected direction is refined
- **THEN** desktop and mobile screen layouts use coherent typography, spacing, states and navigation

### Requirement: Usable states and reviewed tokens
The design specification SHALL define semantic colours, text hierarchy, focus states, form errors and loading/empty/failure states.

#### Scenario: A screen has no results
- **WHEN** a filtered discovery view is empty
- **THEN** the proposed layout provides an understandable recovery action without invented jobs

#### Scenario: Accessibility is assessed
- **WHEN** final type and colour tokens are proposed
- **THEN** contrast, focus, labels and small-screen readability are checked separately from image appearance

