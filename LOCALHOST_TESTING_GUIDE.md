# 🧪 Localhost Testing Guide for Sponsor Payment Page

## 📋 Prerequisites

1. **Local API Server Running** (or AWS Dev API)
2. **Stripe Test Account** - For testing payments
3. **Web Browser** - Chrome, Firefox, Safari, or Edge
4. **Mobile App Token** - For authentication (or test user account)

## 🚀 Setup Steps

### Step 1: Start Local API Server (Optional)

If you want to test with your local API:

```bash
cd /Users/chrisxu/cloudRescue/services/api
npx serverless offline
```

The API will run on: `http://localhost:3000/dev/api`

**Note:** The sponsor page is already configured to use `http://localhost:3000/dev/api` when running on localhost.

### Step 2: Start Website Local Server

```bash
cd /Users/chrisxu/cloudRescue-website

# Option 1: Python HTTP Server
python3 -m http.server 8000

# Option 2: PHP Built-in Server
php -S localhost:8000

# Option 3: Node.js http-server
npx http-server -p 8000
```

### Step 3: Open Sponsor Page

Open your browser and navigate to:

```
http://localhost:8000/sponsor.html?dogId=YOUR_DOG_ID&type=specific
```

**Or for testing different types:**

```bash
# Specific dog sponsorship (5 weeks)
http://localhost:8000/sponsor.html?dogId=507f1f77bcf86cd799439011&type=specific

# Size-based sponsorship (weekly)
http://localhost:8000/sponsor.html?dogId=507f1f77bcf86cd799439011&type=sized

# Random sponsorship
http://localhost:8000/sponsor.html?type=random

# Renewal
http://localhost:8000/sponsor.html?adoptionId=507f1f77bcf86cd799439011&action=renew&weeks=5
```

## 🔐 Authentication

### Option 1: Use Existing Token (Recommended)

1. **Get token from mobile app:**
   - Open mobile app and log in
   - Check browser DevTools → Application → Local Storage
   - Copy the `authToken` value

2. **Set token in browser console:**
   ```javascript
   localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
   ```

3. **Refresh the page** - The page will use this token for API calls

### Option 2: Create Test User via API

```bash
# Send verification code
curl -X POST http://localhost:3000/dev/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890","countryCode":"+1"}'

# Verify code (use the code sent to your phone/SMS service)
curl -X POST http://localhost:3000/dev/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890","countryCode":"+1","code":"1234"}'

# Copy the token from response and set in localStorage
```

## 💳 Testing Payment Flow

### Test Cards (Stripe Test Mode)

The page automatically uses **Stripe test keys** when running on localhost.

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/34` (any future date)
- CVC: `123` (any 3 digits)
- ZIP: `12345` (any 5 digits)

**3D Secure Authentication:**
- Card: `4000 0025 0000 3155`
- Complete the authentication challenge when prompted

**Declined Payment:**
- Card: `4000 0000 0000 9995`

### Testing Steps

1. **Navigate to sponsor page** with valid parameters
2. **Check authentication** - Should redirect to login if no token
3. **View dog/adoption info** - Should display correctly
4. **Click "Continue to Payment"** - Should load Stripe Elements
5. **Enter test card details** - Use test card above
6. **Submit payment** - Should process successfully
7. **Check redirect** - Should redirect to success page or app

## 🐛 Troubleshooting

### Issue: "Authentication error"

**Solution:**
- Make sure you have a valid token in `localStorage`
- Check that the API is running and accessible
- Verify token hasn't expired

**Debug:**
```javascript
// In browser console
console.log('Token:', localStorage.getItem('authToken'));
console.log('API URL:', window.location.hostname === 'localhost' ? 'http://localhost:3000/dev/api' : 'https://api.cloudrescuefoundation.org/api');
```

### Issue: "Failed to load dog information"

**Solution:**
- Verify the `dogId` parameter is valid
- Check API is running and dog exists in database
- Check browser console for API errors

**Debug:**
```javascript
// Test API directly
fetch('http://localhost:3000/dev/api/dogs/YOUR_DOG_ID')
  .then(r => r.json())
  .then(console.log);
```

### Issue: "Stripe Elements not loading"

**Solution:**
- Check browser console for Stripe.js errors
- Verify Stripe test key is correct
- Make sure `https://js.stripe.com/v3/` is loading

**Debug:**
```javascript
// Check if Stripe is loaded
console.log('Stripe:', typeof Stripe !== 'undefined' ? 'Loaded' : 'Not loaded');
```

### Issue: "Payment not processing"

**Solution:**
- Check browser console for errors
- Verify payment intent is created successfully
- Check Stripe dashboard for payment attempts

**Debug:**
```javascript
// Check payment state
console.log('State:', window.sponsorPayment?.state);
```

## 📱 Testing on Mobile Device

### Option 1: Test on Same Network

1. **Find your computer's IP address:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Access from mobile device:**
   ```
   http://YOUR_IP_ADDRESS:8000/sponsor.html?dogId=...
   ```

3. **Set authToken:**
   - Open browser DevTools on mobile (if possible)
   - Or use a proxy like Fiddler/Charles
   - Set token in localStorage via console

### Option 2: Use ngrok (Recommended)

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Start local server
python3 -m http.server 8000

# In another terminal, expose port 8000
ngrok http 8000

# Use the ngrok URL from your mobile device
# Example: https://abc123.ngrok.io/sponsor.html?dogId=...
```

## ✅ Testing Checklist

- [ ] Page loads with dogId parameter
- [ ] Page loads with type=random parameter
- [ ] Page loads with renewal parameters
- [ ] Authentication redirects to login when no token
- [ ] Dog information displays correctly
- [ ] Price calculation is correct
- [ ] Stripe Elements loads
- [ ] Payment form displays
- [ ] Test card payment succeeds
- [ ] Success page displays
- [ ] Deep link redirects to app (on mobile)
- [ ] Error messages display correctly
- [ ] Loading states work correctly

## 🔍 Browser Console Commands

Use these commands in the browser console for debugging:

```javascript
// Check current state
console.log('State:', window.sponsorPayment?.state);

// Check API config
console.log('API URL:', API_CONFIG.getBaseUrl());
console.log('Stripe Key:', API_CONFIG.getStripeKey().substring(0, 20) + '...');

// Manually trigger payment
window.sponsorPayment.processPayment();

// Check authentication
fetch(`${API_CONFIG.getBaseUrl()}/auth/me`, {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
}).then(r => r.json()).then(console.log);
```

## 📝 Notes

- **Localhost automatically uses test Stripe keys** - No need to change configuration
- **API URL switches automatically** - localhost → local API, production → production API
- **Authentication required** - Set token before testing payment flow
- **Test cards only work in test mode** - Real cards will be declined

## 🚀 Next Steps

After testing successfully on localhost:

1. **Deploy to production** (S3 + CloudFront)
2. **Update Stripe production key** in `sponsor.js`
3. **Test with real API** in production environment
4. **Verify deep linking** works from mobile app

Happy testing! 🎉

