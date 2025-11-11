# Deployment Guide for Cloud Rescue Foundation Website

## Prerequisites
- Node.js 18+ installed
- Domain: cloudrescuefoundation.org
- AWS account (for deployment)

## Build & Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm start
```

Visit http://localhost:3000 to preview the website.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/cloudrescue-website.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add `cloudrescuefoundation.org`
   - Add DNS records as instructed:
     ```
     A Record: @ → 76.76.21.21
     CNAME Record: www → cname.vercel-dns.com
     ```

### Option 2: AWS Amplify

1. **Push to GitHub** (same as above)

2. **Deploy to AWS Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub repository
   - Build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Deploy

3. **Configure Custom Domain**
   - In Amplify app settings, go to Domain Management
   - Add `cloudrescuefoundation.org`
   - Follow DNS configuration instructions

### Option 3: AWS S3 + CloudFront (Static Export)

Note: This requires converting to static export. Some features may need adjustment.

1. **Update next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     // ... other config
   };
   ```

2. **Build static files**
   ```bash
   npm run build
   ```

3. **Upload to S3**
   - Create S3 bucket: `cloudrescuefoundation.org`
   - Enable static website hosting
   - Upload contents of `out/` directory
   - Configure bucket policy for public access

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Set origin to S3 bucket
   - Configure SSL certificate for cloudrescuefoundation.org
   - Set default root object to `index.html`
   - Configure error pages (404 → /404.html)

5. **Update DNS**
   - Add CNAME record: `cloudrescuefoundation.org` → CloudFront domain

## Environment Variables

No environment variables required for the current version. If you add API integrations later, create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.cloudrescuefoundation.org
# Add other variables as needed
```

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test language switcher (EN ↔ 中文)
- [ ] Test all navigation links
- [ ] Test mobile hamburger menu
- [ ] Verify all pages load correctly:
  - [ ] Home (/)
  - [ ] About (/about)
  - [ ] How It Works (/how-it-works)
  - [ ] FAQ (/faq)
  - [ ] For Shelters (/shelters)
  - [ ] Success Stories (/stories)
- [ ] Test App Store badges links
- [ ] Verify responsive design on mobile devices
- [ ] Test on different browsers (Chrome, Safari, Firefox, Edge)
- [ ] Verify SEO meta tags (view source)
- [ ] Check sitemap.xml accessibility
- [ ] Test page load speed (Google PageSpeed Insights)
- [ ] Verify SSL certificate is active

## Performance Optimization

### Recommended CloudFlare Settings (Optional)
If using CloudFlare in front of your deployment:

1. **Caching**
   - Enable auto minify for JS, CSS, HTML
   - Set cache level to "Standard"
   - Browser cache TTL: 4 hours

2. **Speed**
   - Enable Auto Minify
   - Enable Brotli compression
   - Enable HTTP/2 and HTTP/3

3. **Security**
   - SSL mode: Full (strict)
   - Enable HSTS
   - Enable automatic HTTPS rewrites

## Monitoring

### Performance Monitoring
- Google Analytics (optional)
- Google Search Console
- Vercel Analytics (if using Vercel)

### Lighthouse Scores to Maintain
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

Run Lighthouse audit:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://cloudrescuefoundation.org --view
```

## Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Deployment Issues
- Ensure Node.js version is 18+
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure environment variables are set correctly

## Updating the Website

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Test locally
npm run dev

# Build and deploy
npm run build
# Push to trigger automatic deployment (Vercel/Amplify)
# Or upload new build to S3
```

## Support

For deployment issues, contact:
- Technical: admin@cloudrescuefoundation.org

## Security Notes

- Never commit `.env.local` or sensitive files
- Keep dependencies updated: `npm audit` and `npm update`
- Monitor for security vulnerabilities
- Use HTTPS only
- Enable CORS properly if adding API endpoints

