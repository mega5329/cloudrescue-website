# 🔍 Payment Form Not Showing - Troubleshooting

## Issue

User clicks "Continue to Website to Sponsor" button but doesn't see the Stripe payment form.

## Possible Causes

### 1. ❌ URL Issue (404 Error)
**Problem:** App opens `/sponsor` but file is `/sponsor.html`

**Fix:** Already fixed - URLs now use `.html` extension

### 2. 🔐 Authentication Redirect
**Problem:** Page redirects to login (no auth token in localStorage)

**Solution:** 
- Check browser console for redirect
- Set auth token: `localStorage.setItem('authToken', 'YOUR_TOKEN')`

### 3. 📋 Payment Form is Hidden by Default
**Problem:** Payment form only shows AFTER clicking "Continue to Payment"

**Expected Flow:**
1. Page loads → Shows dog info
2. Click "Continue to Payment" button
3. Payment form appears

### 4. ❌ JavaScript Error
**Problem:** Error prevents form from showing

**Check:**
- Open browser console (F12)
- Look for JavaScript errors
- Check Network tab for failed API calls

### 5. 🐕 Dog Info Not Loading
**Problem:** API call to fetch dog fails

**Check:**
- Browser console for API errors
- Network tab for failed requests
- Verify dogId is valid

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console

Open browser console (F12) and look for:

```javascript
// Should see:
🚀 Sponsor page loaded
🔗 Opening browser: {url: '...', ...}
```

### Step 2: Check Authentication

```javascript
// In browser console
console.log('Token:', localStorage.getItem('authToken'));

// If null, you'll be redirected to login
// Set token:
localStorage.setItem('authToken', 'YOUR_TOKEN');
location.reload();
```

### Step 3: Check Dog Loading

```javascript
// In browser console - should see API calls
// Check Network tab for:
GET /api/dogs/YOUR_DOG_ID
```

### Step 4: Verify Payment Form Flow

The payment form is **hidden by default**. You need to:

1. ✅ See dog information displayed
2. ✅ Click "Continue to Payment" button
3. ✅ Payment form should appear

---

## ✅ Expected Behavior

### Initial Page Load:
- ✅ Shows dog information
- ✅ Shows "Continue to Payment" button
- ❌ Payment form is HIDDEN (this is normal!)

### After Clicking "Continue to Payment":
- ✅ Button disappears
- ✅ Payment form appears
- ✅ Stripe Elements loads

---

## 🐛 Common Issues

### Issue: "Redirected to /login"

**Cause:** No auth token

**Fix:**
```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN');
location.reload();
```

### Issue: "Invalid sponsorship parameters"

**Cause:** Missing URL parameters

**Fix:** URL must include:
- `?dogId=XXX&type=specific`
- Or `?type=random`
- Or `?adoptionId=XXX&action=renew&weeks=5`

### Issue: "Failed to load dog information"

**Cause:** API error or invalid dogId

**Fix:**
- Check API is accessible
- Verify dogId exists in database
- Check CORS settings

---

## 🧪 Quick Test

1. **Open page:**
   ```
   https://cloudrescuefoundation.org/sponsor.html?dogId=TEST&type=specific
   ```

2. **Set auth token (console):**
   ```javascript
   localStorage.setItem('authToken', 'YOUR_TOKEN');
   location.reload();
   ```

3. **Check what you see:**
   - ✅ Dog info → Good!
   - ✅ "Continue to Payment" button → Good!
   - ❌ Payment form → This is normal, click the button!

4. **Click "Continue to Payment":**
   - ✅ Payment form should appear
   - ✅ Stripe Elements should load

---

## 📝 Summary

The payment form is **hidden by default** and only shows after clicking "Continue to Payment" button. This is by design!

**If you're not seeing ANYTHING:**
- Check browser console for errors
- Verify auth token is set
- Check if being redirected to login

