# Navijob

Production-minded monorepo for Navijob.

## Structure

```txt
Navijob/
├── frontend/   # Next.js landing page + Supabase waitlist form
└── backend/    # Django project with schema synced to Supabase/Postgres
```

## Current flow

```txt
Next.js landing page -> Supabase Postgres table: waitlist_leads
```

## Future flow

```txt
Next.js frontend -> Django REST API -> same Postgres schema
```

The Django `WaitlistLead` model is intentionally aligned with the Supabase SQL table.

## Product planning and design

The current release scope is in [PRODUCT_PLAN.md](PRODUCT_PLAN.md). See the
[OpenSpec milestone board](openspec/BOARD.md), [local workflow](openspec/README.md)
and [the selected visual direction and palette options](designs/README.md) before implementing new features.

View the mockups in [the image gallery](assets/index.html), or run `xdg-open assets/index.html` from this folder. All design images are stored under [assets/](assets/README.md).
