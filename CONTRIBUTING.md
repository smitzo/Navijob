# Contributing to Navijob

Navijob is being built as a production-minded job platform for premium startup roles. Every change should make the product easier to trust, operate, and extend.

## Commit Message Standard

Use Conventional Commits for every commit:

```txt
<type>(<scope>): <summary>
```

Examples:

```txt
docs(contributing): define project contribution rules
feat(jobs): add application status model
test(jobs): cover job application validation
```

Allowed commit types:

- `feat`: adds product behavior or a user-facing backend capability.
- `fix`: corrects a bug.
- `docs`: changes documentation only.
- `test`: adds or updates tests.
- `refactor`: restructures code without changing behavior.
- `chore`: updates setup, tooling, or maintenance files.
- `style`: formatting-only changes.

Rules:

- Keep the subject line under 72 characters.
- Use lowercase type and scope.
- Write the summary in imperative mood, such as `add`, `define`, or `validate`.
- Make one logical change per commit.
- Do not mix unrelated refactors with feature work.
- If a commit adds or changes a backend feature, update `UNDERSTANDING.md` in the same commit.
- Prefer small commits that can be reviewed independently.

## Coding Guidelines

### Backend

- Keep Django apps organized around business concepts.
- Put reusable timestamp fields in shared abstract models.
- Prefer explicit model choices over free-form strings for important states.
- Add database indexes for fields used in filtering, lookup, or ordering.
- Keep model methods small and predictable.
- Make admin screens useful enough for operators to inspect data quickly.
- Expose API behavior through serializers and viewsets instead of ad hoc views when CRUD is needed.
- Validate business rules close to the boundary where data enters the system.
- Add tests for model constraints, serializer validation, and important API behavior.

### API

- Return structured JSON responses.
- Keep public list endpoints read-only unless authentication is intentionally added.
- Avoid exposing internal notes, admin-only flags, or private fields by default.
- Use stable URL namespaces under `/api/`.
- Add filtering/search support only when it maps to a real user workflow.

### Documentation

- Keep `README.md` focused on how to run the project.
- Keep `UNDERSTANDING.md` focused on why decisions were made.
- Explain beginner-facing concepts in plain language before using framework terms.
- Document tradeoffs when choosing one approach over another.

### Quality Bar

Before finishing backend work, run:

```bash
cd backend
python manage.py check
python manage.py test
```

If tests cannot run, document the exact reason in the handoff.
