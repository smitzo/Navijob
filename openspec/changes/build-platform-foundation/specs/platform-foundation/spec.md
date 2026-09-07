## ADDED Requirements

### Requirement: Real account sessions
The platform SHALL authenticate real users and support email confirmation, logout and account recovery with clear error handling.

#### Scenario: Session expires
- **WHEN** a candidate opens an authenticated page with an expired session
- **THEN** the user is asked to sign in and can return to the safe intended page

#### Scenario: Recovery request is submitted
- **WHEN** an account recovery form is used
- **THEN** the response avoids disclosing account existence and explains the next step

### Requirement: Server-enforced role boundaries
The backend SHALL authorize every private operation using the authenticated user and permitted company membership.

#### Scenario: Role is changed in the browser
- **WHEN** a candidate alters client-side role or identity values
- **THEN** privileged API access remains denied

#### Scenario: Demo credentials are used
- **WHEN** a local demonstration session requests real candidate data
- **THEN** the backend does not accept it as production authorization

### Requirement: Selected accessible interface foundation
The shared UI SHALL apply the recorded visual direction consistently and expose usable labels, focus and errors.

#### Scenario: Keyboard navigation is used
- **WHEN** a user tabs through navigation and a form
- **THEN** focus is visible, order is logical and errors are associated with their fields

