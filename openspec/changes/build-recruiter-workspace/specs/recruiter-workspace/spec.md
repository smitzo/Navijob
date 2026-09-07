## ADDED Requirements

### Requirement: Company-scoped recruiter authority
Recruiters SHALL manage only companies and roles for which their authority is established.

#### Scenario: Recruiter changes company identifier
- **WHEN** an authenticated recruiter requests another company's applicants
- **THEN** the backend denies access

#### Scenario: Company request is pending
- **WHEN** a newly registered recruiter has not been checked
- **THEN** the workspace shows the review state without implying verified employer status

### Requirement: Reviewed role lifecycle
Recruiters SHALL create drafts, request publication, resolve review feedback and close roles while preserving history.

#### Scenario: Draft is submitted for review
- **WHEN** a recruiter completes required role information
- **THEN** the role enters the review queue and is not publicly visible until approved

#### Scenario: Published role is closed
- **WHEN** an authorized recruiter closes a role
- **THEN** new applications stop and existing applicant history remains available

### Requirement: Structured private applicant review
Recruiters SHALL review submitted snapshots and update allowed stages with private notes and an audit trail.

#### Scenario: Stage changes
- **WHEN** a recruiter moves an application to an allowed interview stage
- **THEN** the history is recorded and the candidate sees the permitted status

#### Scenario: Invalid transition is requested
- **WHEN** a recruiter requests a disallowed state transition
- **THEN** the backend rejects it without corrupting application history

