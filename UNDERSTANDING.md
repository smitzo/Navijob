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
