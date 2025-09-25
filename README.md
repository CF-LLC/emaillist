# Email List Application

A complete, production-ready email list/waitlist system built with Next.js, using only free services.

## ✨ Features

- 📧 **Email Collection**: Beautiful waitlist form with validation
- 📊 **Real-time Counter**: Live subscriber count
- ✉️ **Welcome Emails**: Automatic confirmation emails via Resend  
- 🛡️ **Duplicate Prevention**: No duplicate email addresses
- 📱 **Responsive Design**: Works on all devices
- 🔒 **Admin Dashboard**: Manage and export your email list
- 📈 **Analytics**: Track signups and engagement
- 🚀 **Free Hosting**: Deploy to GitHub Pages

## 🆓 Free Services Stack

- **Storage**: [Upstash Redis](https://upstash.com) (10K requests/day)
- **Email Service**: [Resend](https://resend.com) (100 emails/day)  
- **Hosting**: GitHub Pages (unlimited static sites)
- **Domain**: GitHub Pages subdomain (free)

## 🚀 Quick Setup

### 1. Clone and Install
```bash
git clone https://github.com/CF-LLC/emaillist.git
cd emaillist
npm install
```

### 2. Configure Services

#### Upstash Redis (Free)
1. Sign up at [console.upstash.com](https://console.upstash.com/redis)
2. Create a new Redis database
3. Copy the REST URL and Token

#### Resend Email (Free) 
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your sending domain (or use test mode)

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your actual keys
```

### 4. Development
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to GitHub Pages
```bash
npm run build
# Push to main branch - GitHub Actions will deploy automatically
```

## 📊 Admin Dashboard

Access the admin panel at `/admin` with your configured password to:
- View all subscribers
- Export email list as CSV
- See signup statistics
- Manage unsubscribes

## 🎨 Customization

- Edit `app/components/waitlist-signup.tsx` for the main form
- Modify `app/components/email-template.tsx` for welcome emails
- Update `app/layout.tsx` for branding and metadata
- Customize styles in `app/globals.css`

## 🔧 Configuration Options

See `.env.example` for all configuration options including:
- Redis connection settings
- Email service configuration  
- Admin password
- Analytics tracking
- Custom branding

## 📈 Scaling

This setup handles:
- **10,000 signups/month** (Upstash free tier)
- **3,000 emails/month** (Resend free tier)
- **Unlimited traffic** (GitHub Pages)

For higher volume, upgrade to paid tiers or switch to alternatives like:
- **Storage**: Railway PostgreSQL, PlanetScale MySQL
- **Email**: SendGrid, Mailgun, Amazon SES
- **Hosting**: Vercel, Netlify, Railway

## 🛡️ Privacy & GDPR

- No personal data stored beyond email addresses
- Built-in unsubscribe functionality
- GDPR-compliant data handling
- Optional cookie-free analytics

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

PRs welcome! See CONTRIBUTING.md for guidelines.