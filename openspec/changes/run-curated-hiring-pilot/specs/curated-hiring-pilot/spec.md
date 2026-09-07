## ADDED Requirements

### Requirement: Consent-based checked pilot scope
The pilot SHALL identify participating candidates, checked roles, responsible hiring contacts and permitted sharing.

#### Scenario: Candidate has not opted in
- **WHEN** an employer requests a candidate profile outside an approved application or introduction
- **THEN** the profile is not shared

#### Scenario: Role has no responsible contact
- **WHEN** a proposed pilot role cannot be confirmed
- **THEN** it is not represented as an active partner role

### Requirement: Honest pilot measurements
Pilot reporting SHALL distinguish registration, repeated use, native submission, self-report, qualified response and hiring outcomes.

#### Scenario: Candidate uses the product twice
- **WHEN** a candidate returns for a second real application
- **THEN** repeat usage is counted separately from signup and founder-driven demonstration

#### Scenario: Outcome is not observed
- **WHEN** an employer has not reported an interview or hire
- **THEN** the outcome remains unknown rather than inferred from a submitted application

### Requirement: Recorded continuation decision
The pilot SHALL end with an evidence-based continue, narrow, revise or pause decision and a scoped next change.

#### Scenario: Employer value is weak
- **WHEN** the cohort produces little qualified response or repeat employer use
- **THEN** the next plan addresses the observed problem before expanding paid listings or AI add-ons

