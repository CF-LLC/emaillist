# Deployment Guide

This guide will help you deploy your email list application to GitHub Pages for free.

## Prerequisites

1. **Upstash Redis Account** (Free)
   - Sign up at [console.upstash.com](https://console.upstash.com/redis)
   - Create a new Redis database
   - Copy the REST URL and Token

2. **Resend Account** (Free) 
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from dashboard
   - Verify your domain (or use test mode)

## Deployment Steps

### 1. Configure Repository Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:

```
UPSTASH_REDIS_REST_URL=your-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=your-redis-rest-url  
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your-redis-token
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-admin-password
NEXT_PUBLIC_APP_URL=https://yourusername.github.io/emaillist
```

### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Source: **GitHub Actions**
3. The workflow will automatically deploy on push to main

### 3. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_REDIS_REST_URL }}
          UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_REDIS_REST_TOKEN }}
          NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: ${{ secrets.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL }}
          NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: ${{ secrets.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          NEXT_PUBLIC_ADMIN_PASSWORD: ${{ secrets.NEXT_PUBLIC_ADMIN_PASSWORD }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
          
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 4. Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/emaillist.git
cd emaillist

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual credentials
# Start development server
npm run dev
```

### 5. Access Your Application

After deployment:
- **Main Site**: `https://yourusername.github.io/emaillist`
- **Admin Panel**: `https://yourusername.github.io/emaillist/admin`
- **Unsubscribe**: `https://yourusername.github.io/emaillist/unsubscribe`

## Features Available

### For Users
- ✅ Beautiful waitlist signup form
- ✅ Email validation and duplicate prevention
- ✅ Welcome email confirmation
- ✅ Real-time subscriber counter
- ✅ Mobile-responsive design
- ✅ Social media links
- ✅ Unsubscribe functionality

### For Admins
- ✅ Secure admin dashboard at `/admin`
- ✅ View all subscribers
- ✅ Export email list as CSV
- ✅ Analytics (today, week, month, total)
- ✅ Remove subscribers
- ✅ Password protection

## Cost Breakdown (Free Tier)

| Service | Free Tier Limit | Cost After |
|---------|-----------------|------------|
| **Upstash Redis** | 10,000 requests/day | $0.20 per 100K requests |
| **Resend** | 100 emails/day | $20/month for 50K emails |
| **GitHub Pages** | Unlimited static hosting | Always free |
| **Domain** | github.io subdomain | Custom domain: ~$10/year |

**Total Monthly Cost**: $0 for up to 3,000 signups and 3,000 emails per month.

## Scaling Options

When you outgrow free tiers:

### Storage Alternatives:
- **PlanetScale MySQL** (Free tier: 1B row reads/month)
- **Railway PostgreSQL** ($5/month)
- **Supabase PostgreSQL** (Free tier: 500MB)

### Email Service Alternatives:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **Amazon SES** ($0.10 per 1,000 emails)

### Hosting Alternatives:
- **Vercel** (Free tier: 100GB bandwidth)
- **Netlify** (Free tier: 100GB bandwidth)  
- **Railway** ($5/month)

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure Redis credentials are valid
- Verify Resend API key is active

### Emails Not Sending
- Verify Resend domain is confirmed
- Check API key permissions
- Monitor Resend dashboard for errors

### Admin Panel Access
- Verify `NEXT_PUBLIC_ADMIN_PASSWORD` is set
- Check browser console for errors
- Ensure proper authentication

## Support

For issues or questions:
1. Check the GitHub Issues
2. Review environment variable setup
3. Verify service credentials
4. Check build logs in GitHub Actions

## Security Notes

- Admin password is stored in environment variables
- Redis credentials should never be exposed in client code
- Use strong passwords for admin access
- Regularly rotate API keys
- Monitor service usage dashboards