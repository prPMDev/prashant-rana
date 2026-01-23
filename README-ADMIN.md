# Portfolio Template with Admin UI (Future Idea)

**Status:** Scaffolded, not functional. Paused indefinitely.

## Vision

Package this portfolio as a **reusable template** that others can fork and customize without touching code.

- Non-technical users can set up their own portfolio
- Admin UI for editing companies, projects, content
- No JSON editing required

## What's Here

```
admin.html              - Admin page shell
js/admin/admin.js       - Panel with login + tabs (Companies/Projects/Config)
js/admin/admin-auth.js  - Simple auth (password-based)
css/admin-styles.css    - Admin UI styles
work-artifacts/         - Per-company data structure (empty)
```

## What's Missing

- CRUD operations for companies/projects
- Actual data in work-artifacts/*.json
- Image upload handling
- Export/save functionality
- Documentation for template users

## If Resuming

1. Decide: flat JSON (current main) vs. per-company folders (this branch)?
2. Build actual edit/save functions in admin.js
3. Add form validation
4. Consider localStorage vs. file download for "saving"
5. Write setup guide for template users

## Why Paused

Current workflow (edit work.json + Claude Code) is faster for personal use. Admin UI only makes sense if packaging for others.

---

*Last updated: Jan 2026*
