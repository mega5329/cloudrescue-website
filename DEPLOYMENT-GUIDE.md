# Deployment Guide - Cloud Rescue Foundation

## 🚀 Quick Deploy to S3

### Prerequisites
1. AWS CLI installed
2. AWS credentials configured
3. S3 bucket `cloudrescuefoundation.org` created
4. (Optional) CloudFront distribution created

### Method 1: Automated Script (Recommended)

```bash
cd /Users/chrisxu/cloudRescue-website
./deploy-to-s3.sh
```

The script will:
- ✅ Check AWS CLI installation
- ✅ Verify AWS credentials
- ✅ Sync all files to S3
- ✅ Set proper cache headers
- ✅ (Optional) Invalidate CloudFront cache

### Method 2: Manual AWS CLI Commands

```bash
# Navigate to website directory
cd /Users/chrisxu/cloudRescue-website

# Sync all files to S3
aws s3 sync . s3://cloudrescuefoundation.org \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "*.sh" \
  --exclude "README.md" \
  --delete \
  --acl public-read

# Set cache headers for HTML (1 hour)
aws s3 cp s3://cloudrescuefoundation.org/ s3://cloudrescuefoundation.org/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=3600" \
  --content-type "text/html" \
  --acl public-read

# Set cache headers for CSS/JS (1 year)
aws s3 cp s3://cloudrescuefoundation.org/css/ s3://cloudrescuefoundation.org/css/ \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --acl public-read

aws s3 cp s3://cloudrescuefoundation.org/js/ s3://cloudrescuefoundation.org/js/ \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --acl public-read

# If using CloudFront, invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Method 3: AWS Console (Manual Upload)

1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Click on bucket `cloudrescuefoundation.org`
3. Click **Upload**
4. Drag and drop all files/folders from `/Users/chrisxu/cloudRescue-website`
5. Under **Permissions**, select **Grant public-read access**
6. Click **Upload**
7. Wait for upload to complete

## ⚙️ S3 Bucket Configuration

### Enable Static Website Hosting

1. Go to S3 Console → `cloudrescuefoundation.org` → **Properties**
2. Scroll to **Static website hosting**
3. Click **Edit**
4. Enable **Static website hosting**
5. **Index document**: `index.html`
6. **Error document**: `index.html`
7. Click **Save changes**

### Bucket Policy (Make Public)

Go to **Permissions** → **Bucket Policy** and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cloudrescuefoundation.org/*"
    }
  ]
}
```

### CORS Configuration (if needed)

Go to **Permissions** → **Cross-origin resource sharing (CORS)**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

## ☁️ CloudFront Configuration

### If CloudFront Already Exists:

1. Get your Distribution ID:
   ```bash
   aws cloudfront list-distributions --query 'DistributionList.Items[?Aliases.Items[0]==`cloudrescuefoundation.org`].Id' --output text
   ```

2. Invalidate cache after deployment:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

### If CloudFront Needs Setup:

1. **Origin Settings:**
   - Origin domain: `cloudrescuefoundation.org.s3-website-us-east-1.amazonaws.com`
   - Origin protocol policy: HTTP only
   - Name: `S3-cloudrescuefoundation`

2. **Default Cache Behavior:**
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Allowed HTTP methods: GET, HEAD, OPTIONS
   - Cache policy: CachingOptimized
   - Compress objects automatically: Yes

3. **Distribution Settings:**
   - Alternate domain names (CNAMEs):
     - `cloudrescuefoundation.org`
     - `www.cloudrescuefoundation.org`
   - SSL Certificate: Select your ACM certificate (must be in us-east-1)
   - Default root object: `index.html`

4. **Custom Error Responses:**
   - HTTP 404 → Response page path: `/index.html`, HTTP code: 200
   - HTTP 403 → Response page path: `/index.html`, HTTP code: 200

## 🔒 SSL Certificate (if not already configured)

1. Go to **AWS Certificate Manager** in **us-east-1** region
2. **Request a public certificate**
3. Domain names:
   - `cloudrescuefoundation.org`
   - `*.cloudrescuefoundation.org`
4. Validation method: **DNS validation**
5. Add CNAME records to Route 53 (provided by ACM)
6. Wait for validation (5-30 minutes)
7. Attach to CloudFront distribution

## 🌐 Route 53 DNS Configuration

### If Route 53 Already Setup:

Verify A records exist:
- `cloudrescuefoundation.org` → Alias to CloudFront distribution
- `www.cloudrescuefoundation.org` → Alias to CloudFront distribution

### If Route 53 Needs Setup:

1. Create hosted zone for `cloudrescuefoundation.org`
2. Add A record (Alias):
   - Name: (leave blank for apex)
   - Type: A - IPv4 address
   - Alias: Yes
   - Alias target: Your CloudFront distribution
3. Add A record for www:
   - Name: `www`
   - Type: A - IPv4 address
   - Alias: Yes
   - Alias target: Your CloudFront distribution

## 📝 Deployment Checklist

### Before First Deployment:
- [ ] AWS CLI installed: `aws --version`
- [ ] AWS credentials configured: `aws configure`
- [ ] S3 bucket exists: `cloudrescuefoundation.org`
- [ ] Bucket has static website hosting enabled
- [ ] Bucket policy allows public read access
- [ ] CloudFront distribution created (optional but recommended)
- [ ] SSL certificate issued and validated
- [ ] Route 53 DNS records configured

### For Each Deployment:
- [ ] Test website locally: `http://localhost:9000`
- [ ] All pages work correctly
- [ ] Language switching works (EN/中文)
- [ ] Mobile navigation works
- [ ] All links functional
- [ ] Run deployment script: `./deploy-to-s3.sh`
- [ ] Wait for CloudFront invalidation (if applicable)
- [ ] Test live site: `https://cloudrescuefoundation.org`
- [ ] Verify HTTPS works (green lock)
- [ ] Test on mobile devices

## 🧪 Testing After Deployment

```bash
# Test HTTP response
curl -I https://cloudrescuefoundation.org

# Should return:
# HTTP/2 200
# content-type: text/html

# Test all pages
curl -I https://cloudrescuefoundation.org/about.html
curl -I https://cloudrescuefoundation.org/how-it-works.html
curl -I https://cloudrescuefoundation.org/faq.html
curl -I https://cloudrescuefoundation.org/shelters.html
curl -I https://cloudrescuefoundation.org/stories.html

# Test assets
curl -I https://cloudrescuefoundation.org/css/styles.css
curl -I https://cloudrescuefoundation.org/js/main.js
```

## 🔧 Troubleshooting

### Issue: "Access Denied" error
**Solution:**
- Check S3 bucket policy is public
- Verify all files have public-read ACL
- Make sure you're using S3 website endpoint in CloudFront (not REST API)

### Issue: Changes not showing
**Solution:**
- Clear browser cache (Cmd+Shift+R)
- Invalidate CloudFront cache
- Wait 5-15 minutes for propagation

### Issue: 404 on page refresh
**Solution:**
- Add custom error response in CloudFront: 404 → /index.html (200)
- Enable static website hosting in S3

### Issue: SSL certificate error
**Solution:**
- Certificate must be in us-east-1 region for CloudFront
- Verify certificate is validated and issued
- Check CloudFront distribution has correct certificate attached

### Issue: www not working
**Solution:**
- Add `www.cloudrescuefoundation.org` to CloudFront alternate domains
- Create A record for `www` in Route 53

## 💰 Cost Estimate

For a small marketing website:
- **S3 Storage**: ~$0.50/month (for ~100MB)
- **CloudFront**: $1-5/month (for low-medium traffic)
- **Route 53**: $0.50/month (hosted zone)
- **Data Transfer**: Included in CloudFront pricing

**Total**: ~$2-6/month for typical traffic

## 📊 Performance Optimization

### Already Optimized:
- ✅ Tailwind CSS via CDN (cached globally)
- ✅ Minimal custom CSS (~5KB)
- ✅ Minimal JavaScript (~10KB total)
- ✅ No build process
- ✅ Google Fonts with preconnect

### After Deployment:
- ✅ CloudFront compression (Gzip)
- ✅ Global CDN edge locations
- ✅ Proper cache headers
- ✅ HTTPS/2 support

## 🎯 Quick Commands

```bash
# Deploy to S3
cd /Users/chrisxu/cloudRescue-website && ./deploy-to-s3.sh

# Manual sync (no cache headers)
aws s3 sync . s3://cloudrescuefoundation.org --acl public-read --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"

# List S3 files
aws s3 ls s3://cloudrescuefoundation.org/ --recursive

# Check website endpoint
aws s3 website s3://cloudrescuefoundation.org
```

## 🔗 Useful Links

- **S3 Console**: https://console.aws.amazon.com/s3/
- **CloudFront Console**: https://console.aws.amazon.com/cloudfront/
- **Route 53 Console**: https://console.aws.amazon.com/route53/
- **ACM Console** (us-east-1): https://console.aws.amazon.com/acm/home?region=us-east-1

## 📞 Support

If you encounter issues:
1. Check AWS service status: https://status.aws.amazon.com/
2. Review CloudWatch logs
3. Contact AWS Support

---

**Ready to deploy?** Run `./deploy-to-s3.sh` and your website will be live! 🚀

