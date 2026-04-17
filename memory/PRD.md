# Experimental Elaichi - PRD

## Problem Statement
Build a colourful food blog called "Experimental Elaichi" that looks Indian and experimental, to document experimental recipes that taste amazing.

## Architecture
- **Frontend**: React (CRA + Craco) with Tailwind CSS, Shadcn UI, Framer Motion, Lenis
- **Backend**: FastAPI (Python) with JWT Bearer token auth
- **Database**: MongoDB (Motor async driver)
- **Auth**: Bearer token (localStorage) - admin-only recipe management

## User Personas
- **Visitor**: Browses recipes, searches by keyword, filters by category, views recipe details
- **Admin**: Logs in, creates/edits/deletes recipes via admin dashboard

## Core Requirements
- Public recipe listing with search and category filters
- Recipe detail page with split layout (sticky ingredients, scrollable instructions)
- Admin login with JWT Bearer token auth
- Admin dashboard to create/edit/delete recipes
- URL-based recipe images
- Editorial/zine design with Indian spice color palette

## What's Been Implemented (April 2026)
- Full recipe CRUD API (GET/POST/PUT/DELETE with pagination)
- Admin seeding on startup
- JWT Bearer token authentication
- Homepage with hero section, recipe cards grid, search, category filters
- Recipe detail page with ingredients sidebar and numbered instructions
- Admin login page
- Admin dashboard with recipe creation/editing form
- Footer component
- 4 seeded experimental Indian recipes
- Deployment-ready (CORS *, no hardcoded secrets)

## Prioritized Backlog
### P0 (Done)
- Recipe listing, detail, search, filter
- Admin auth & recipe management
- Deployment readiness

### P1 (Next)
- About page with blog story
- Recipe sharing (social links)
- Print-friendly recipe view
- Mobile hamburger menu

### P2 (Future)
- Newsletter signup
- Recipe comments
- Related recipes suggestions
- Recipe rating system
- SEO meta tags for recipes
