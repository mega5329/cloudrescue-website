# 🧪 Test Stripe Payment on Localhost

## ✅ YES! You can test payment on localhost

The payment page is **already configured** to automatically:
- ✅ Use **localhost API** when accessed via `localhost`
- ✅ Use **Stripe TEST keys** (not real charges)
- ✅ Work with your local development setup

---

## 🚀 Quick Start

### Step 1: Start Website Server (If Not Running)

```bash
cd /Users/chrisxu/cloudRescue-website
python3 -m http.server 8000
```

✅ Server should be running on: `http://localhost:8000`

### Step 2: Open Payment Page in Browser

Open your browser and go to:

```
http://localhost:8000/sponsor.html?dogId=YOUR_DOG_ID&type=specific
```

**Example:**
```
http://localhost:8000/sponsor.html?dogId=507f1f77bcf86cd799439011&type=specific
```

### Step 3: Set Authentication Token

The page needs an authentication token. Open browser console (F12) and run:

```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
```

**Get token from:**
- Mobile app (if logged in)
- Or create test user via API (see below)

---

## 🔧 Localhost Configuration (Automatic)

When you access the page via `localhost`, it automatically:

### API URL:
```javascript
// Automatically uses localhost API
http://localhost:3000/dev/api
```

### Stripe Key:
```javascript
// Automatically uses TEST key (not real charges)
pk_test_51SM6hM1SYzaxow6Rmipz13HXttuMvQBw3Yv3gPbMWyWJunmV8iwnLDpwC1h1BRwT7rMp61Ybk6NvGxCvbTW5xCJF00knlMklRf
```

**No configuration needed!** It detects `localhost` automatically.

---

## 💳 Test Payment Cards

When testing on localhost, use Stripe **test cards**:

### ✅ Successful Payment:
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

### ❌ Declined Payment:
```
Card Number: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### 🔐 3D Secure (Requires Auth):
```
Card Number: 4000 0025 0000 3155
Expiry: 12/34
CVC: 123
ZIP: 12345
```

---

## 📋 Complete Testing Steps

### 1. Check Servers Running

```bash
# Website server (port 8000)
lsof -ti:8000 && echo "✅ Running" || echo "❌ Not running"

# Local API server (port 3000) - Optional
lsof -ti:3000 && echo "✅ Running" || echo "❌ Not running (will use AWS dev API)"
```

### 2. Open Payment Page

```
http://localhost:8000/sponsor.html?dogId=TEST&type=specific
```

### 3. Set Auth Token

In browser console:
```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN');
location.reload();
```

### 4. Test Payment Flow

1. Click "Continue to Payment"
2. Enter test card: `4242 4242 4242 4242`
3. Enter expiry: `12/34`
4. Enter CVC: `123`
5. Enter ZIP: `12345`
6. Click "Complete Payment"
7. ✅ Payment should succeed (no real charge!)

---

## 🔍 Verify Configuration

Open browser console (F12) and check:

```javascript
// Check API URL being used
console.log('API URL:', API_CONFIG.getBaseUrl());

// Check Stripe key being used
console.log('Stripe Key:', API_CONFIG.getStripeKey().substring(0, 20) + '...');

// Should show:
// API URL: http://localhost:3000/dev/api
// Stripe Key: pk_test_51SM6hM1SYz...
```

---

## 🐛 Troubleshooting

### Issue: "API connection failed"

**Solution:** Start local API server:
```bash
cd /Users/chrisxu/cloudRescue/services/api
npx serverless offline
```

Or the page will use AWS dev API as fallback.

### Issue: "Authentication error"

**Solution:** Set auth token:
```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN');
location.reload();
```

### Issue: "Stripe not loading"

**Check:**
- Open browser console for errors
- Verify `https://js.stripe.com/v3/` is loading
- Check network tab for blocked requests

---

## ✅ Summary

**Everything is already configured for localhost testing:**

- ✅ Automatically detects `localhost`
- ✅ Uses test Stripe keys (no real charges)
- ✅ Points to local API or AWS dev API
- ✅ Website server running on port 8000
- ✅ Ready to test!

**Just open:**
```
http://localhost:8000/sponsor.html?dogId=YOUR_DOG_ID&type=specific
```

And test with Stripe test cards! 🎉

