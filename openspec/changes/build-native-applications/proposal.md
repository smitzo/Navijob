## Why

Native applications should reuse candidate information while preserving exactly what was disclosed to an employer.

## What Changes

- Build resume selection, job-specific questions and an explicit review/submit flow.
- Store immutable application snapshots and prevent duplicates.
- Expose candidate application history and permitted status updates; identify external tracking separately.

Dependencies: M03, M04. Non-goals: Submitting to external ATSs, AI-generated answers, employer ranking guarantees or exposing recruiter private notes.

## Capabilities

### New Capabilities

- `native-job-applications`: Apply with a profile and track applications.

### Modified Capabilities

None. Existing application behavior must be audited rather than presumed production-ready.

## Impact

backend jobs/application models and APIs, candidate application review/tracking UI. This is a proposed milestone; implementation tasks remain open.

