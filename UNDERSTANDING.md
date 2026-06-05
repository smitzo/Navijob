# Understanding Navijob Backend

This file explains the backend decisions in beginner-friendly language. It is meant to be read together with the commit history: when a backend feature is added, the reasoning is added here too.

## Product Goal

Navijob is a job platform for premium startup jobs. That means the backend should help answer three basic questions:

1. Which startups are allowed to post trusted jobs?
2. Which jobs are high-quality enough to show to candidates?
3. Which applicants and recruiters are connected to each job process?

The backend uses Django because Django gives us a reliable structure for data models, admin screens, database migrations, and API endpoints. Those are the boring but important parts of a job marketplace.

## Why Start With Models

A model is the Python class that describes what gets stored in the database. For example, a job model says a job has a title, company, salary range, location, and status.

We start with models before building fancy screens because the database shape becomes the foundation for everything else. If the data is confusing, the API and frontend become confusing too.

## Current Backend Direction

The first backend setup focuses on:

- Companies: the startups that post roles.
- Recruiters: the people who manage hiring for those startups.
- Applicants: the candidates looking for premium startup roles.
- Jobs: the actual job listings.
- Applications: the connection between an applicant and a job.

The design prefers simple Django models over premature microservices. A beginner can think of this as keeping all the core business data in one well-organized backend before splitting anything apart.

## Applicant Profiles

An applicant profile stores candidate information that is specific to job searching: target roles, skills, location, portfolio links, and whether the person is open to work.

This is separate from Django's built-in user account. The user account answers "who can log in?" while the applicant profile answers "what kind of job is this person looking for?" Keeping those separate avoids turning the authentication table into a messy product table.

I chose a one-to-one relationship with the user because one login should normally have one candidate profile. I chose JSON fields for skills and target roles for the first backend version because they let us move quickly without creating many small lookup tables too early.

## Recruiter Profiles

A recruiter profile stores hiring-side information: which company the recruiter represents, their role title, contact details, and whether they are verified.

The recruiter is also separate from the user account. This matters because a person can log in as a user, but the product still needs to know whether that person has permission to manage jobs for a startup.

I chose a protected company relationship instead of deleting recruiters automatically when a company is removed. In hiring data, accidental deletion is expensive. Protecting the relationship makes the system ask us to handle company removal deliberately.

## Company Profiles

The company model represents the startup posting jobs. Premium startup hiring needs more trust information than a generic job board, so the model includes stage, company size, funding summary, headquarters, careers URL, and partner verification.

I chose explicit choices for startup stage and company size because those values are useful for filtering. If we let everyone type free-form values, we would end up with messy data like `Series A`, `series-a`, and `A round` all meaning the same thing.

The model keeps both `is_verified` and `is_premium_partner`. Verified means the company identity is trusted. Premium partner means the company has a stronger business relationship with Navijob. Those are related ideas, but they are not the same.

## Job Listing Lifecycle

A job listing now has a `status`: draft, published, closed, or archived. This is different from deleting a job.

Deleting removes data. Closing or archiving keeps history. That matters for a job platform because applications, analytics, and recruiter activity can still be useful after a role is no longer open.

The job model also stores seniority, such as junior, senior, lead, or executive. I chose explicit choices because seniority is a common search filter and should stay consistent across listings.

## Compensation for Premium Startup Jobs

The job listing stores salary and equity separately. Salary is the cash pay. Equity is ownership in the startup, usually written as a percentage.

I chose separate `salary_min`, `salary_max`, `equity_min`, and `equity_max` fields instead of a single compensation text box because structured numbers can be filtered, compared, and validated. A text box is still useful for nuance, but it should not be the only source of truth.

The model includes `currency` and `salary_period` because `120000 USD per year` and `120000 INR per month` are completely different offers. Storing the period prevents misleading comparisons.

## Recruiter-Owned Job Listings

A job listing can point to the recruiter profile that posted it. This does not replace the company relationship. The company tells us which startup owns the role; the recruiter tells us which human account is responsible for it.

I chose `SET_NULL` for the recruiter relationship. If a recruiter leaves a company, the job history should remain. The listing can survive while the `posted_by` field becomes empty until another recruiter takes responsibility.

The model keeps both `apply_url` and `apply_email` because startups vary. Some use an applicant tracking system, while early-stage teams may still accept email applications.

## Structured Job Content

The job model keeps a normal `description`, but it also stores responsibilities, requirements, and benefits as separate lists.

I chose this over putting everything into one large description because the frontend can later show cleaner sections, and the backend can eventually compare jobs more intelligently. For example, requirements can power matching while benefits can help candidates compare offers.

The `premium_score` and `featured_until` fields are early curation tools. They let Navijob promote especially strong startup roles without changing the basic job model later.

## Job Applications

A job application connects one applicant profile to one job listing. It stores status, cover letter, optional resume, answers to extra questions, and review timestamps.

I chose a separate `JobApplication` model instead of putting application data on the job or applicant because applications are their own business event. One applicant can apply to many jobs, and one job can receive many applications.

The database prevents the same applicant from applying to the same job twice by using a unique constraint. This keeps the data clean even if a frontend bug accidentally sends the same request more than once.

## Model Validation

The job model validates important ranges before saving. Minimum salary cannot be higher than maximum salary. Minimum equity cannot be higher than maximum equity. Premium score is capped at 100.

The application model validates business rules too. Applications are only allowed for active, published jobs, and a selected resume must belong to the same applicant.

I chose model-level validation because it protects the data even if the object is created from a script, the Django admin, or a future API endpoint. Serializer validation is still useful, but the model is the last line of defense.

## Account Admin Screens

Applicant and recruiter profiles are registered in the Django admin. This lets an operator search by user email, inspect profile details, and filter by useful states like open-to-work or verified recruiter.

I chose admin registration early because marketplaces often need manual review before automation is perfect. A simple admin screen lets the team correct data and investigate issues without writing database queries.

## Company Admin Screen

Companies are registered in the admin with filters for stage, size, verification, and premium partner status.

I chose these filters because an operator will often need to answer questions like "which companies are verified?" or "which Series A companies are premium partners?" without touching SQL.

## Job Admin Screens

Jobs and applications are registered in the Django admin. The listing admin focuses on status, seniority, work mode, job type, and premium flags. The application admin focuses on candidate progress.

I chose to register applications separately from jobs because reviewing a job and reviewing candidate submissions are different operator tasks. Keeping them separate makes the admin easier to scan.

## Serializers

Serializers turn Django model objects into JSON and validate JSON coming into the API. They are the bridge between the database world and the frontend world.

Company, applicant, recruiter, job, and application serializers are separated by business concept. Job list responses use a smaller serializer than job detail responses, because list pages should be fast and compact while detail pages can include richer text.

I chose nested read-only summaries for company and recruiter data. That means the frontend can show useful context with a job without needing several extra API calls immediately.

## Job API

The public jobs API is read-only. Anyone can browse published, active jobs, but the endpoint does not let anonymous users create or edit listings.

The job list endpoint supports practical filters like search query, work mode, job type, seniority, location, and premium status. These match the first workflows a candidate will expect when browsing startup jobs.

Applications are authenticated. The backend looks for the current user's applicant profile and attaches new applications to that profile. I chose this over letting the frontend send an applicant ID because frontend-supplied ownership IDs are easy to fake.

## Backend Tests

The first test coverage focuses on model validation and API behavior.

The model tests check that invalid salary ranges are rejected, applications cannot target draft jobs, and applicants cannot attach someone else's resume. The API tests check that public job browsing only shows published active jobs, search works, authenticated applicants can apply, and users without applicant profiles cannot apply.

I chose these tests first because they protect trust. A premium job platform needs clean listings and controlled applications before it needs advanced features.

## Implementation Log

- Company admin screens make startup verification and premium partner review visible from Django admin.
- Job admin screens make listings and applications inspectable before custom internal tools exist.
- Company serializers define compact and detailed JSON shapes for startup profiles.
- Account serializers expose applicant and recruiter profiles without letting clients rewrite trusted identity fields.
- Job serializers separate list, detail, and application shapes so each endpoint returns only the data it needs.
- Job API viewsets publish read-only browsing and authenticated application creation under stable `/api/` routes.
