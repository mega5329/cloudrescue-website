# Fix CloudFront Origin - Step-by-Step Guide

## 🎯 Problem
Your CloudFront distribution is pointing to the wrong S3 bucket origin. It needs to be updated to point to the correct S3 website endpoint.

## ✅ Current Status
- ✅ Files deployed to S3: `cloudrescuefoundation.org`
- ✅ S3 static website hosting: **ENABLED**
- ✅ Bucket policy: **PUBLIC READ**
- ✅ S3 website endpoint working: http://cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com
- ⚠️ CloudFront origin: Points to wrong bucket (`cloudrescue-production`)

## 🔧 Fix Required
Update CloudFront distribution `EXPOPFIYRTZ9I` to use the correct origin.

---

## 📋 Step-by-Step Instructions

### Step 1: Go to CloudFront Console
1. Open your browser
2. Go to: https://console.aws.amazon.com/cloudfront/v3/home
3. Log in to AWS Console

### Step 2: Find Your Distribution
1. Look for distribution ID: `EXPOPFIYRTZ9I`
2. Or look for domain name: `d30yhygt4ayeow.cloudfront.net`
3. Click on the Distribution ID to open it

### Step 3: Edit the Origin
1. Click on the **Origins** tab
2. You should see one origin listed
3. **Select the origin** (click the checkbox)
4. Click **Edit** button

### Step 4: Update Origin Domain Name
In the Edit Origin screen:

**Current (WRONG):**
```
cloudrescue-production.s3.us-east-1.amazonaws.com
```

**Change to (CORRECT):**
```
cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com
```

⚠️ **IMPORTANT**: Use the **website endpoint**, NOT the REST API endpoint!

### Step 5: Update Other Settings

While editing the origin, make sure these settings are correct:

| Setting | Value |
|---------|-------|
| **Protocol** | HTTP only |
| **Origin path** | (leave blank) |
| **Name** | S3-cloudrescuefoundation (or any name) |
| **Enable Origin Shield** | No (optional) |

### Step 6: Save Changes
1. Scroll to the bottom
2. Click **Save changes**
3. Wait for deployment status to show "Deployed" (this takes 5-15 minutes)

### Step 7: Verify Custom Error Responses (Optional but Recommended)

1. Go to **Error pages** tab
2. Make sure these custom error responses exist:

| HTTP Error Code | Response Page Path | HTTP Response Code |
|-----------------|--------------------|--------------------|
| 403 | /index.html | 200 |
| 404 | /index.html | 200 |

If they don't exist:
1. Click **Create custom error response**
2. Add the entries above
3. Click **Create**

### Step 8: Wait for Deployment
1. Go back to **General** tab
2. Wait for **Status** to change from "In Progress" to "Deployed"
3. This usually takes 5-15 minutes

### Step 9: Test Your Website
Once deployment is complete, test:

```bash
# Test main domain
curl -I https://cloudrescuefoundation.org

# Should return: HTTP/2 200

# Test in browser
open https://cloudrescuefoundation.org
```

---

## 🖼️ Visual Guide

### Finding the Origins Tab:
```
CloudFront Console
└── Distributions
    └── EXPOPFIYRTZ9I
        └── Origins (tab) ← Click here
```

### What You'll See in Origins:
```
Origin Domain Name: cloudrescue-production.s3.us-east-1.amazonaws.com
                    ↓
                    CHANGE THIS
                    ↓
Origin Domain Name: cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com
```

---

## ❓ FAQ

### Q: Why do I need to use the website endpoint?
**A:** The S3 REST API endpoint (`s3.us-east-1.amazonaws.com`) doesn't support:
- Custom error pages (404 → index.html)
- Index documents (index.html)
- Proper routing for single-page behavior

The website endpoint (`s3-website-us-east-1.amazonaws.com`) supports all these features.

### Q: Will this break anything?
**A:** No! It will only improve the website functionality.

### Q: Do I need to invalidate CloudFront cache again?
**A:** Yes, recommended. After changing the origin, run:
```bash
aws cloudfront create-invalidation --distribution-id EXPOPFIYRTZ9I --paths "/*"
```

Or wait for natural cache expiration (usually 24 hours by default).

### Q: How long does it take?
**A:** CloudFront deployment takes 5-15 minutes after you save changes.

---

## 🚀 After Fixing

Once the origin is updated and deployed:

✅ **https://cloudrescuefoundation.org** - Works!
✅ **https://www.cloudrescuefoundation.org** - Works!
✅ All pages accessible with clean URLs
✅ 404 errors redirect to homepage
✅ HTTPS with SSL certificate
✅ Global CDN delivery

---

## 📞 Need Help?

If you get stuck:
1. Take a screenshot of the CloudFront Origins screen
2. Check CloudFront distribution status is "Deployed"
3. Verify the origin domain name is **exactly**: `cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com`

---

## ✅ Verification Commands

After updating, run these commands to verify:

```bash
# Check CloudFront origin
aws cloudfront get-distribution --id EXPOPFIYRTZ9I \
  --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' \
  --output text

# Should output: cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com

# Test website
curl -I https://cloudrescuefoundation.org

# Should return: HTTP/2 200
```

---

**Good luck! Your website will be live once this is updated!** 🎉

