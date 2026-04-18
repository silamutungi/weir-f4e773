# WEIR

> Built with [Visila](https://visila.com)

## What this app does

<!-- One sentence describing the core problem this solves -->

## Top user stories

- As a user, I can sign up and log in securely
- As a user, I can [core feature 1]
- As a user, I can [core feature 2]
- As a user, I can manage my account and data
- As a user, I can access the app on any device

## Run locally

```bash
npm install
cp .env.example .env  # fill in your Supabase keys
npm run dev
```

## Deploy

This app auto-deploys to Vercel on every push to main.
Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables.

## You own everything

GitHub: https://github.com/silamutungi/weir-f4e773
Vercel: https://vercel.com/dashboard
Supabase: https://supabase.com/dashboard

Visila provisioned this. You own it entirely.

## NEXT STEPS

### Deployment Instructions

1. **Initial Deployment**
   - Push code to the main branch on GitHub
   - Vercel automatically deploys on every push
   - Verify deployment at your Vercel dashboard

2. **Environment Setup**
   - Go to Vercel project settings
   - Add environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Redeploy after adding variables

3. **Production Verification**
   - Test authentication flow
   - Verify database connections
   - Check error logs in Vercel dashboard

### Feature Roadmap

- [ ] Implement [core feature 1]
- [ ] Implement [core feature 2]
- [ ] Add user profile customization
- [ ] Implement notification system
- [ ] Add analytics tracking
- [ ] Mobile app optimization
- [ ] Social sharing features
- [ ] Advanced search functionality

### Development Guidelines

- **Code Standards**
  - Follow existing code style and conventions
  - Use TypeScript for new components
  - Write clear commit messages

- **Testing**
  - Test locally with `npm run dev`
  - Test authentication flows before deployment
  - Check responsive design on multiple devices

- **Documentation**
  - Update README when adding features
  - Document environment variables
  - Keep user stories current

- **Git Workflow**
  - Create feature branches for new work
  - Use descriptive branch names
  - Submit pull requests for code review
  - Merge to main only after testing