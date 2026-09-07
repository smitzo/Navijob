## ADDED Requirements

### Requirement: Reusable editable career information
Candidates SHALL maintain their own experience, education, skills, links, preferences and availability without re-entering it for every native application.

#### Scenario: Profile validation fails
- **WHEN** a candidate submits an invalid date range
- **THEN** the form retains entered data, identifies the error and does not save contradictory history

#### Scenario: Another profile is requested
- **WHEN** a user requests a different candidate's private profile
- **THEN** private access is denied

### Requirement: Private named resume versions
Candidates SHALL upload and select up to four private resume files under reviewed format and size limits.

#### Scenario: Upload limit is reached
- **WHEN** a candidate with four active resumes uploads a fifth
- **THEN** the product explains the limit and replacement/archive options without losing existing files

#### Scenario: Attachment access is attempted
- **WHEN** an unrelated user guesses a resume URL or identifier
- **THEN** the file is not disclosed

### Requirement: Scoped project evidence and sharing
Project records SHALL distinguish candidate claims, contribution context, maturity and linked evidence, with public visibility disabled until chosen.

#### Scenario: Project link is added
- **WHEN** a candidate links a public GitHub repository
- **THEN** the UI presents a link or scoped connection signal rather than verified professional ability

#### Scenario: Public sharing is not enabled
- **WHEN** a recruiter browses outside a submitted application
- **THEN** the candidate's private career information remains unavailable

