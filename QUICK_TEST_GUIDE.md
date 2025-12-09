# ⚡ Quick Test Guide - Localhost Payment

## 🚀 Test Right Now

### 1. Open Payment Page

```
http://localhost:8000/sponsor.html?dogId=YOUR_DOG_ID&type=specific
```

### 2. Set Auth Token (Browser Console F12)

```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
location.reload();
```

### 3. Test Payment

Click "Continue to Payment" → Use test card `4242 4242 4242 4242`

---

## ✅ What's Already Configured

- ✅ **Website server** running on port 8000
- ✅ **Auto-detects localhost** for API URL
- ✅ **Uses Stripe test keys** (no real charges)
- ✅ **Ready to test!**

---

## 💳 Test Cards

**Success:**
- `4242 4242 4242 4242`

**Decline:**
- `4000 0000 0000 9995`

**3D Secure:**
- `4000 0025 0000 3155`

