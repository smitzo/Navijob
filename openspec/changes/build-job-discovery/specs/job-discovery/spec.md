## ADDED Requirements

### Requirement: Searchable reviewable roles
Discovery SHALL show approved published open roles with searchable fields, useful filters, sorting and pagination.

#### Scenario: Filters change
- **WHEN** a candidate changes location or work-mode filters
- **THEN** the URL and result set remain consistent and can be restored with browser navigation

#### Scenario: No role matches
- **WHEN** a search returns zero results
- **THEN** an honest empty state offers filter recovery without fabricated listings

### Requirement: Clear job and company context
Role pages SHALL show application mode, posting source, requirements, work context and compensation units where known.

#### Scenario: Compensation is not supplied
- **WHEN** a recruiter has not provided a salary range
- **THEN** the page labels compensation as undisclosed and does not infer a figure

#### Scenario: Role closes
- **WHEN** a candidate opens a saved closed role
- **THEN** the role is visibly closed and cannot accept a new native application

### Requirement: Owned saved jobs
Authenticated candidates SHALL save and remove jobs in their own account.

#### Scenario: Visitor saves a role
- **WHEN** an unauthenticated visitor chooses Save
- **THEN** the product requests login and can return to that role

#### Scenario: Private saved list is requested
- **WHEN** one candidate requests another's saved list
- **THEN** access is denied

