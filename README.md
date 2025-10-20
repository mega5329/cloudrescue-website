# Cloud Rescue Foundation Website

A simple, fast, and fully static website built with pure HTML, CSS, and JavaScript.

## 🚀 Features

- ✅ **Pure HTML/CSS/JavaScript** - No frameworks, no build process
- ✅ **Bilingual** - English and Chinese with smooth switching
- ✅ **Mobile-First** - Optimized for all screen sizes
- ✅ **Fast Loading** - Minimal dependencies, Tailwind via CDN
- ✅ **S3 Ready** - Deploy directly to AWS S3 or any static host

## 📁 Project Structure

```
cloudRescue-website/
├── index.html           # Home page
├── about.html           # About page
├── how-it-works.html    # How it works
├── faq.html             # FAQ
├── shelters.html        # For shelters
├── stories.html         # Success stories
├── css/
│   └── styles.css       # Custom styles
├── js/
│   ├── main.js          # Main application
│   ├── language.js      # Language switching
│   ├── mobile-nav.js    # Mobile navigation
│   └── animations.js    # Scroll animations
├── images/              # Image assets
├── videos/              # Video assets
└── locales/
    ├── en.json          # English translations
    └── zh.json          # Chinese translations
```

## 🧪 Testing Locally

### Option 1: Python HTTP Server
```bash
# Navigate to project directory
cd /Users/chrisxu/cloudRescue-website

# Start server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

### Option 2: PHP Built-in Server
```bash
php -S localhost:8000
```

### Option 3: Node.js http-server
```bash
npx http-server -p 8000
```

## 🌐 Deploy to AWS S3

### Quick Deploy
```bash
# Sync to S3
aws s3 sync . s3://cloudrescuefoundation.org --exclude ".git/*" --delete

# Set public-read permissions
aws s3 sync . s3://cloudrescuefoundation.org --acl public-read --exclude ".git/*"
```

### Enable Static Website Hosting
1. Go to S3 Console → Bucket → Properties
2. Enable "Static website hosting"
3. Index document: `index.html`
4. Error document: `index.html`

### CloudFront Setup
1. Create CloudFront distribution
2. Origin: S3 website endpoint (not REST API)
3. Alternate domain names: `cloudrescuefoundation.org`, `www.cloudrescuefoundation.org`
4. SSL Certificate: Request via ACM in `us-east-1`
5. Custom error responses: 404 → `/index.html` (200)

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --orange-primary: #FF6B35;
  --teal-accent: #4ECDC4;
  /* ... more colors */
}
```

### Content
Edit translation files in `locales/`:
- `en.json` - English content
- `zh.json` - Chinese content

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 12+, macOS)
- ✅ Samsung Internet

## 📄 License

© 2025 Cloud Rescue Foundation. All rights reserved.

