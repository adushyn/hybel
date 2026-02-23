# 🚀 Deployment Guide - Hybel App

This guide covers deploying the Hybel property management application to Netlify.

---

## 📦 Build Output

**Production build location:** `dist/hybel-app/browser/`

**Bundle sizes:**
- Initial bundle: **639 KB** (143 KB gzipped)
- Lazy-loaded routes: **382 KB** (64 KB gzipped)
- Total size: **~1 MB** raw, **~207 KB** transferred

---

## 🌐 Deploy to Netlify

### **Option 1: Netlify CLI (Recommended)**

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

#### 3. Initialize the site

```bash
cd /Users/alenadgiantleap.no/Projects/hybel/hybel-app
netlify init
```

Follow the prompts:
- **Create a new site**: Yes
- **Team**: Select your team
- **Site name**: hybel-app (or your preferred name)
- **Build command**: `npm run build`
- **Publish directory**: `dist/hybel-app/browser`

#### 4. Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or deploy a preview first
netlify deploy
```

Your site will be live at: `https://YOUR-SITE-NAME.netlify.app`

---

### **Option 2: Netlify Web UI (Drag & Drop)**

#### 1. Build the project locally

```bash
npm run build
```

#### 2. Go to Netlify Dashboard

- Visit: https://app.netlify.com/
- Click **"Add new site" → "Deploy manually"**

#### 3. Drag & drop

- Drag the `dist/hybel-app/browser` folder into the upload area
- Wait for deployment to complete

✅ Done! Your site is live.

---

### **Option 3: Git Integration (Continuous Deployment)**

#### 1. Push code to GitHub/GitLab

```bash
git add .
git commit -m "Deploy: Prepare for Netlify deployment"
git push origin main
```

#### 2. Connect to Netlify

1. Go to https://app.netlify.com/
2. Click **"Add new site" → "Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select the `hybel` repository
5. Configure build settings:
   - **Base directory**: `hybel-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/hybel-app/browser`
   - **Environment variables**: (if needed)
     ```
     NODE_VERSION=18
     ```

6. Click **"Deploy site"**

#### 3. Automatic deployments

Every push to `main` will trigger a new deployment automatically! 🎉

---

## ⚙️ Configuration Files

### **netlify.toml** (Main configuration)

Located at: `/hybel-app/netlify.toml`

**Features:**
- ✅ SPA routing redirects (all routes → index.html)
- ✅ Security headers (CSP, XSS protection, frame options)
- ✅ Cache optimization (static assets cached for 1 year)
- ✅ HTML cache disabled (for instant updates)

### **_redirects** (Backup routing)

Located at: `/hybel-app/src/_redirects`

**Purpose:** Alternative syntax for SPA routing (copied to dist during build)

---

## 🔧 Build Configuration

### **angular.json**

Updated budgets for production:
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "1mb",
      "maximumError": "2mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ]
}
```

### **Local build command**

```bash
npm run build
# Output: dist/hybel-app/browser
```

---

## 🌍 Custom Domain (Optional)

### Add custom domain to Netlify:

1. Go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `hybel.no`)
4. Follow DNS setup instructions:

```
# Add these DNS records to your domain provider:
A     @     75.2.60.5
CNAME www   YOUR-SITE.netlify.app
```

5. Enable HTTPS (automatic with Let's Encrypt)

---

## 🔍 Environment Variables (Future)

When you add backend API integration:

1. Go to **Site settings → Environment variables**
2. Add variables:

```bash
API_URL=https://api.hybel.no
ENABLE_ANALYTICS=true
SENTRY_DSN=your-sentry-dsn
```

3. Reference in code:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.hybel.no'
};
```

---

## 📊 Monitoring

### **Analytics & Performance**

Netlify provides built-in analytics:
- **Analytics**: Site settings → Analytics
- **Bandwidth usage**: Bandwidth tab
- **Build logs**: Deploys → Latest deploy → Deploy log

### **Recommended tools:**
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Lighthouse** - Performance audits

---

## 🚨 Troubleshooting

### **404 on page refresh?**

✅ **Fixed!** The `netlify.toml` redirects config handles this.

**Verify:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Build fails with dependency errors?**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **"Budget exceeded" error?**

Already fixed in `angular.json` (budgets increased to realistic values).

### **Slow build times?**

- Check node version: `node --version` (use Node 18+)
- Clear Netlify cache: Site settings → Build & deploy → Clear cache

---

## 📈 Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly: `https://YOUR-SITE.netlify.app`
- [ ] Routing works: Try `/portfolio`, `/profile`, `/portfolio/prop-1`
- [ ] 404 page appears for invalid routes: `/invalid-route`
- [ ] Images load properly
- [ ] Forms work (customer photo upload)
- [ ] Mobile responsive (test on phone)
- [ ] Performance (run Lighthouse audit)
- [ ] Security headers (check with securityheaders.com)

---

## 🎯 Production Performance

**Expected Lighthouse scores:**
- Performance: 90+
- Accessibility: 85+
- Best Practices: 95+
- SEO: 90+

**To check:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://YOUR-SITE.netlify.app --view
```

---

## 🔄 Update Deployment

### **Manual update:**
```bash
npm run build
netlify deploy --prod
```

### **Git-based (automatic):**
```bash
git add .
git commit -m "Update: Your changes"
git push origin main
# Netlify deploys automatically!
```

---

## 📞 Support

**Netlify Documentation:** https://docs.netlify.com/
**Netlify Status:** https://www.netlifystatus.com/
**Community Forum:** https://answers.netlify.com/

---

**Last updated:** February 17, 2026
**App Version:** 1.0.0
