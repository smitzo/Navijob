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
