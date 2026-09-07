## ADDED Requirements

### Requirement: Audited operator moderation
Authorized operators SHALL review company, job and public-profile requests with recorded decisions and reasons.

#### Scenario: Listing is rejected
- **WHEN** an operator rejects a publication request
- **THEN** the role remains private and the recruiter receives actionable permitted feedback

#### Scenario: Unprivileged moderation is attempted
- **WHEN** a candidate requests an operator action
- **THEN** the backend denies it and does not change review state

### Requirement: Scoped evidence and private-data control
The product SHALL describe evidence-check scope and provide account-owned export/deletion request workflows.

#### Scenario: GitHub evidence is linked
- **WHEN** a public repository link or account connection is present
- **THEN** the UI does not label all employment or professional skill verified

#### Scenario: Deletion is requested
- **WHEN** a candidate requests deletion
- **THEN** the product records the request and explains treatment of pending, submitted and employer-held copies without an unsupported promise

### Requirement: Pilot-ready product review
A pilot SHALL not be declared ready until representative candidate, recruiter and operator journeys and important recovery paths have recorded verification.

#### Scenario: Release check finds a critical leak
- **WHEN** a review exposes a private resume or cross-company application
- **THEN** pilot readiness remains blocked until the defect and relevant regression checks are resolved

#### Scenario: Demo fixtures remain
- **WHEN** a demonstration route is accessible
- **THEN** its synthetic nature is clear and it cannot imply live hiring activity

