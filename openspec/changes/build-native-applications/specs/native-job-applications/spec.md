## ADDED Requirements

### Requirement: Explicit reviewed native submission
Candidates SHALL review the selected resume and disclosed information before submitting a native application.

#### Scenario: Required answer is missing
- **WHEN** a candidate submits without a job-specific required answer
- **THEN** the submission is rejected with recoverable field errors

#### Scenario: Role has closed
- **WHEN** the role closes before the final submit request
- **THEN** the backend refuses the application and explains the closed role

### Requirement: Immutable owned application snapshots
A native submission SHALL preserve the candidate-approved data and resume snapshot, reject foreign attachments and avoid duplicate applications.

#### Scenario: Candidate edits the master profile
- **WHEN** an existing applicant changes their current career data
- **THEN** the already submitted snapshot remains unchanged

#### Scenario: Submit is repeated
- **WHEN** the same candidate repeats a submit request for the same role
- **THEN** one application exists and the UI gives a clear existing-application result

#### Scenario: Foreign resume is selected
- **WHEN** a candidate supplies another user's resume identifier
- **THEN** the backend refuses the attachment

### Requirement: Honest candidate tracking
Candidates SHALL see their own permitted application history and distinguish native receipts from external self-reports.

#### Scenario: External destination is opened
- **WHEN** a user follows an external application link
- **THEN** NaviJob does not claim an employer submission was confirmed

#### Scenario: Recruiter note exists
- **WHEN** a candidate views an application with recruiter private notes
- **THEN** only permitted public status and communication are exposed

