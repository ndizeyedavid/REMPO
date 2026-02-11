# feat: GitHub Issue Templates & In-App About Section

## Summary
Adds structured GitHub issue templates for better community contributions and implements an About section within the app settings for developer credits and bug reporting.

## Changes Included

### GitHub Issue Templates
- **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.yml`)
  - Structured fields for description, reproduction steps, expected behavior
  - Environment details collection
  - Additional context section
  
- **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.yml`)
  - Problem description field
  - Proposed solution section
  - Alternatives considered
  - Additional context

### In-App Integration
- **Settings → About Tab**: New dedicated section with:
  - App version display (v1.0.4-beta)
  - Developer credits: David NDIZEYE (Full-stack Developer)
  - Direct links to GitHub repo, portfolio, and bug reporting
  - Quick action buttons for "Report a Bug" and "Star on GitHub"
  
- **External Link Handling**: IPC handler to open URLs in system browser

### Community Features
- One-click bug reporting that pre-fills the GitHub issue template
- Developer portfolio link for professional showcase
- "Created with passion" branding with emoji accents
