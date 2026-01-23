# LearnAI Deployment Guide

This guide covers deploying LearnAI to production on Vercel.

## Quick Start

### 1. Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Supabase account and project
- Environment variables ready

### 2. Deploy to Vercel (Recommended)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: LearnAI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learnai.git
git push -u origin main
```

**Step 2: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "GitHub"
4. Find and import your `learnai` repository

**Step 3: Configure Environment Variables**
In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Visit your live URL

### 3. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records with Vercel nameservers
4. Wait for DNS propagation (24-48 hours)

## Local Development

### Setup Local Environment

```bash
# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your_key" >> .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm run start

# Check for build errors
npm run build --verbose
```

## Database Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for project initialization
4. Get project URL and API keys from Settings → API

### Run Database Migrations

1. Open Supabase SQL Editor
2. Copy and run the SQL from `/scripts/setup-db.sql`
3. Verify tables are created:
   - study_sessions
   - notes_summaries
   - exam_preparations
   - chat_messages
   - user_preferences

### Enable Row Level Security

Run this for each table in SQL Editor:

```sql
-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (see INTEGRATION_GUIDE.md for examples)
```

## CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - run: npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Enable ISR for static images
- Optimize PNG/JPG files before upload

### Bundle Analysis
```bash
npm run analyze
# Check bundle size and optimize if needed
```

### Database Optimization
```sql
-- Create indexes for faster queries
CREATE INDEX idx_study_sessions_user_deadline 
  ON study_sessions(user_id, deadline);

CREATE INDEX idx_notes_created_at 
  ON notes_summaries(user_id, created_at DESC);
```

### Caching Strategy
- Enable HTTP caching in Vercel
- Use Redis for session caching (optional)
- Implement ISR for study guides

## Monitoring & Logging

### Enable Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View analytics at Analytics dashboard

### Monitor with Sentry (Optional)
```bash
npm install @sentry/nextjs
```

Add to `next.config.mjs`:
```javascript
import { withSentry } from "@sentry/nextjs";

export default withSentry(nextConfig);
```

### Database Monitoring
- Monitor query performance in Supabase
- Check connection pool usage
- Review error logs regularly

## Backup & Recovery

### Database Backups

**Supabase Automatic Backups:**
- Daily backups (Pro plan)
- Manual backups available
- Point-in-time recovery (with service support)

**Manual Backup:**
```bash
# Export database
pg_dump postgresql://user:password@host/db > backup.sql

# Import backup
psql postgresql://user:password@host/db < backup.sql
```

### Data Export
```bash
# Export all user data (compliance)
# Implement in your app or admin panel
SELECT * FROM study_sessions WHERE user_id = 'xxx';
```

## Troubleshooting

### Common Issues

**Build Fails**
```
Error: Missing environment variables
→ Add all variables in Vercel dashboard
→ Rebuild project

Error: Database connection failed
→ Verify SUPABASE_SERVICE_ROLE_KEY
→ Check Supabase project status
→ Test connection locally
```

**Slow Performance**
```
→ Check bundle size (npm run analyze)
→ Optimize database queries
→ Enable caching
→ Check Vercel Analytics
```

**API Timeouts**
```
→ Increase timeout in API routes
→ Optimize payload size
→ Use streaming for large responses
→ Check network logs
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=*
npm run dev

# Check server logs in Vercel dashboard
# Settings → Function Logs
```

## Security Checklist

- [ ] Change default Supabase password
- [ ] Enable 2FA on all accounts
- [ ] Review RLS policies
- [ ] Set up CORS properly
- [ ] Enable HTTPS only
- [ ] Hide sensitive data in env vars
- [ ] Regular security audits
- [ ] Update dependencies regularly
- [ ] Monitor unauthorized access

## Post-Deployment

### Testing
```bash
# Test critical features
- Study Planner functionality
- Notes Summarizer
- Exam Prep tracking
- Chatbot responses

# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com
```

### Monitoring Tasks
- Check error rates daily
- Monitor database usage
- Review user feedback
- Track performance metrics

### Maintenance
- Update dependencies monthly
- Review security advisories
- Optimize database regularly
- Backup data weekly

## Scaling

### When to Scale
- Traffic exceeds 1000 concurrent users
- Response times increase
- Database is at capacity
- Error rates increase

### Scaling Options
1. **Vercel:** Automatic scaling (Pro plan)
2. **Supabase:** Upgrade to larger plan
3. **CDN:** Enable Vercel Edge Functions
4. **Database:** Upgrade PostgreSQL tier

### Load Balancing
Vercel handles load balancing automatically.

## Rollback

### To Previous Version
```bash
# On GitHub
git revert <commit-hash>
git push

# Vercel automatically redeploys
# Or manually redeploy from Vercel dashboard
```

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **AI SDK Docs:** https://sdk.vercel.ai

## FAQ

**Q: Can I use other databases?**
A: Yes, but update the database integration in API routes.

**Q: Do I need Vercel Pro?**
A: No, Free tier works fine. Pro adds more features.

**Q: How long are backups kept?**
A: Supabase keeps last 7-14 days (free plan).

**Q: Can I scale to enterprise?**
A: Yes, with Vercel Enterprise + Supabase Enterprise.

---

For detailed integration information, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
