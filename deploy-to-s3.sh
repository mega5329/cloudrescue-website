#!/bin/bash

# Cloud Rescue Foundation - S3 Deployment Script
# Deploy pure static website to AWS S3

set -e  # Exit on any error

echo "🚀 Cloud Rescue Foundation - S3 Deployment"
echo "=========================================="

# Configuration
BUCKET_NAME="cloudrescuefoundation.org"
REGION="us-east-1"
PROFILE="default"  # Change if using a different AWS profile

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[1/5]${NC} Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it with: brew install awscli"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI found${NC}"

echo -e "\n${BLUE}[2/5]${NC} Verifying AWS credentials..."
if ! aws sts get-caller-identity --profile $PROFILE &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure --profile $PROFILE"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials verified${NC}"

echo -e "\n${BLUE}[3/5]${NC} Syncing files to S3..."
aws s3 sync . s3://$BUCKET_NAME \
  --profile $PROFILE \
  --region $REGION \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "*.sh" \
  --exclude "README.md" \
  --exclude ".gitignore" \
  --delete \
  --acl public-read

echo -e "${GREEN}✓ Files synced to S3${NC}"

echo -e "\n${BLUE}[4/5]${NC} Setting cache control headers..."

# HTML files - short cache (1 hour)
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --profile $PROFILE \
  --region $REGION \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=3600" \
  --content-type "text/html" \
  --acl public-read

# CSS files - long cache (1 year)
aws s3 cp s3://$BUCKET_NAME/css/ s3://$BUCKET_NAME/css/ \
  --profile $PROFILE \
  --region $REGION \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --content-type "text/css" \
  --acl public-read

# JS files - long cache (1 year)
aws s3 cp s3://$BUCKET_NAME/js/ s3://$BUCKET_NAME/js/ \
  --profile $PROFILE \
  --region $REGION \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --content-type "application/javascript" \
  --acl public-read

# JSON files - short cache (1 hour)
aws s3 cp s3://$BUCKET_NAME/locales/ s3://$BUCKET_NAME/locales/ \
  --profile $PROFILE \
  --region $REGION \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=3600" \
  --content-type "application/json" \
  --acl public-read

echo -e "${GREEN}✓ Cache headers set${NC}"

echo -e "\n${BLUE}[5/5]${NC} Invalidating CloudFront cache (optional)..."
echo -e "${YELLOW}Do you want to invalidate CloudFront cache? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Enter your CloudFront Distribution ID:"
    read -r DISTRIBUTION_ID
    
    if [ -n "$DISTRIBUTION_ID" ]; then
        aws cloudfront create-invalidation \
          --profile $PROFILE \
          --distribution-id $DISTRIBUTION_ID \
          --paths "/*"
        echo -e "${GREEN}✓ CloudFront invalidation created${NC}"
    fi
else
    echo "Skipping CloudFront invalidation"
fi

echo -e "\n${GREEN}=========================================="
echo -e "✅ Deployment Complete!"
echo -e "==========================================${NC}"
echo -e "\nYour website should be live at:"
echo -e "${BLUE}https://cloudrescuefoundation.org${NC}"
echo -e "\n${YELLOW}Note: If using CloudFront, changes may take 5-15 minutes to propagate${NC}"
echo -e "${YELLOW}If not using CloudFront, changes are immediate${NC}\n"
