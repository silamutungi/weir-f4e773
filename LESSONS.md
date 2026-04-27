# WEIR — Brain Memory

## App Context
- **Idea:** WEIR — Helps creators protect and earn money when their name, image, or likeness appears online without permission.. Features: Real-time content match detection across web and social, One-tap actions to take down, monetize, or approve uses, License templates with platform and monetization controls, Earnings dashboard with per-platform CPM breakdown, Dispute resolution for unauthorized ad usage
- **Category:** web app
- **Generated:** 2026-04-18
- **Stack:** React + Vite + TypeScript + Supabase + Vercel
- **Live URL:** https://weir-f4e773.vercel.app
- **Files generated:** 35

## Generation Notes
- Pages: src/pages/Home.tsx, src/pages/Login.tsx, src/pages/Signup.tsx, src/pages/Dashboard.tsx, src/pages/Detections.tsx, src/pages/Licenses.tsx, src/pages/Earnings.tsx, src/pages/Disputes.tsx, src/pages/Settings.tsx, src/pages/Pricing.tsx
- Components: src/components/Navbar.tsx, src/components/AppLayout.tsx, src/components/ProtectedRoute.tsx, src/components/Footer.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/card.tsx, src/components/ui/badge.tsx

## Founder Patterns
<!-- Brain learns the founder's preferences here -->
<!-- Updated automatically after every interaction -->
- Edits to date: 0
- Most edited section: unknown
- Primary focus: unknown
- Launch status: not launched

- [2026-04-26] Pattern after 9 edits: This founder is obsessed with making the product feel real and complete by closing navigation gaps, building out the authenticated user experience, and demonstrating concrete value through realistic dashboards—they're racing to show investors or users a polished, functional platform rather than a collection of disconnected pages.

- [2026-04-26] Pattern after 9 edits: This founder is obsessively focused on making the product feel real and complete—prioritizing a seamless authenticated user experience with functional navigation and concrete value demonstration over polish elsewhere.

- [2026-04-26] Pattern after 9 edits: This founder is obsessively focused on creating a complete, navigable product experience that demonstrates real user value through concrete monetization numbers and seamless logged-in flows.

- [2026-04-26] Pattern after 15 edits: They're obsessively replacing all dynamic/database-driven functionality with hardcoded demo data to create a polished, working visual prototype regardless of actual backend connectivity.

- [2026-04-26] Pattern after 15 edits: They're obsessed with getting a working demo with realistic mock data on screen quickly, treating hardcoded placeholder values as the critical path to a presentable product.

- [2026-04-26] Pattern after 15 edits: They're obsessively trying to get a working demo dashboard with hardcoded mock data displayed to users, repeatedly struggling with the same data-fetching problems and navigation flows.

- [2026-04-27] Pattern after 15 edits: They're obsessively trying to get a working demo dashboard with realistic mock data displayed to users, repeatedly fighting against database fetches that keep breaking it and getting frustrated enough to issue the same instruction multiple times.

## Edit History
<!-- Brain appends after every edit -->
<!-- Format: [date] instruction → files changed → outcome -->

- [2026-04-18] Add a responsive mobile hamburger nav drawer to the site navigation component. Use useState for open → src/components/Navbar.tsx

- [2026-04-18] Wrap the app logo in the nav component with a React Router Link to '/' so clicking it returns to the → src/components/Navbar.tsx

- [2026-04-18] Add a responsive mobile hamburger nav drawer to the site navigation component. Use useState for open → src/components/Navbar.tsx

- [2026-04-19] change hero headliner to: Your likeness earns you money every time it appears online. → src/pages/Home.tsx

- [2026-04-20] Add navigation to → src/components/Navbar.tsx

- [2026-04-26] Add navigation to sign in and sign out. Use same navigation as homepage → src/components/Navbar.tsx

- [2026-04-26] Add navigation to sign in and sign out pages → src/pages/Login.tsx, src/pages/Signup.tsx

- [2026-04-26] If the user is signed in, show a 'Go to dashboard' button in the navbar instead of 'Sign in' and 'St → src/components/Navbar.tsx

- [2026-04-26] "If the user is already signed in, clicking the logo should go to /dashboard instead of the homepage → src/components/Navbar.tsx

- [2026-04-26] Wrap the app logo in the nav component with a React Router Link to '/' so clicking it returns to the → src/components/Navbar.tsx

- [2026-04-26] "Revert the navbar to working state — remove any broken changes → src/components/Navbar.tsx

- [2026-04-26] Remove the unused handleSignOut variable from src/components/Navbar.tsx to fix the TypeScript build  → src/components/Navbar.tsx

- [2026-04-26] The dashboard stats show for a second then reset to zero because there is still a useEffect or async → src/pages/Dashboard.tsx

- [2026-04-26] The dashboard stats are still showing zeros even though Dashboard.tsx has hardcoded values. The data → src/pages/Dashboard.tsx

- [2026-04-26] Add a responsive mobile hamburger nav drawer to the site navigation component. Use useState for open → src/components/Navbar.tsx

- [2026-04-27] Add a responsive mobile hamburger nav drawer to the site navigation component. Use useState for open → src/components/Navbar.tsx

- [2026-04-27] Connect detection matching output to dashboard data binding → src/context/DetectionsContext.tsx, src/pages/Detections.tsx, src/pages/Dashboard.tsx

## Brain Observations
<!-- Proactive hints Brain has surfaced -->
<!-- Format: [date] category: observation -->

## Lessons Learned
<!-- Mistakes made and fixed — never repeat these -->
<!-- Format: [date] what broke → what fixed it -->
