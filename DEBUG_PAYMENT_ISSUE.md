# 🔍 Payment Form Not Showing - Debug Guide

## ❓ What You're Seeing

You click "Continue to Website to Sponsor" button in the app, and the website opens, but you don't see the Stripe payment form.

## ✅ Expected Behavior

The payment form is **hidden by default** and only appears **after clicking "Continue to Payment"** button on the website.

### Step-by-Step Flow:

1. **Website Opens** → Shows dog information
2. **"Continue to Payment" Button** → Visible (orange button)
3. **Click Button** → Payment form appears
4. **Enter Card Details** → Stripe form shows
5. **Submit** → Payment processes

## 🔍 Debugging Checklist

### Check 1: Is the Page Loading?

Open browser console (F12) and check for:
```
🚀 Sponsor page loaded
```

**If you see this:** ✅ Page loaded correctly
**If you don't:** ❌ JavaScript error - check console for errors

### Check 2: Are You Being Redirected to Login?

The page checks authentication first. If no token:
- Automatically redirects to `/login?returnUrl=...`
- You won't see the payment form

**Fix:**
```javascript
// In browser console (F12)
localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
location.reload();
```

### Check 3: Is Dog Information Loading?

Check browser console for:
- API calls to `/api/dogs/YOUR_DOG_ID`
- Error messages about dog loading

**If error:** Check Network tab → Look for failed requests

### Check 4: Do You See the "Continue to Payment" Button?

The button should be visible:
- Orange button with text "Continue to Payment"
- Located below the dog information

**If you see it:** ✅ Normal - click it to show payment form
**If you don't:** ❌ Check console for errors

### Check 5: After Clicking Button, Does Form Appear?

Click "Continue to Payment" → Payment form should:
- Appear below
- Show Stripe payment fields
- Have "Complete Payment" button

**If form appears:** ✅ Working correctly!
**If form doesn't appear:** ❌ Check console for errors

---

## 🐛 Common Issues & Fixes

### Issue 1: Redirected to Login Page

**Symptom:** Page immediately redirects to `/login`

**Cause:** No authentication token

**Fix:**
```javascript
// In browser console
localStorage.setItem('authToken', 'YOUR_TOKEN_FROM_APP');
location.reload();
```

### Issue 2: "Failed to load dog information"

**Symptom:** Error message on page

**Cause:** API error or invalid dogId

**Fix:**
- Check Network tab for failed API calls
- Verify dogId exists in database
- Check API is accessible: `curl https://api.cloudrescuefoundation.org/api/health`

### Issue 3: JavaScript Error in Console

**Symptom:** Red error messages in browser console

**Cause:** JavaScript error preventing form from showing

**Fix:**
- Check console for specific error
- Verify Stripe.js is loading: `https://js.stripe.com/v3/`
- Check for CORS errors

### Issue 4: Payment Form Button Not Clickable

**Symptom:** Button doesn't respond when clicked

**Cause:** JavaScript error or form already processing

**Fix:**
- Check console for errors
- Wait for page to fully load
- Try refreshing page

### Issue 5: URL Returns 404

**Symptom:** Page not found error

**Cause:** Wrong URL (missing `.html` extension)

**Fix:** Already fixed - URLs now use `/sponsor.html`

---

## 🧪 Quick Test

### Step 1: Open Page Directly

```
https://cloudrescuefoundation.org/sponsor.html?dogId=YOUR_DOG_ID&type=specific
```

### Step 2: Open Browser Console (F12)

Check for:
- ✅ `🚀 Sponsor page loaded`
- ❌ Any red error messages

### Step 3: Set Auth Token (if needed)

```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN');
location.reload();
```

### Step 4: Check What You See

- ✅ Dog information displayed
- ✅ "Continue to Payment" button visible
- ❌ Payment form is hidden (this is normal!)

### Step 5: Click "Continue to Payment"

- ✅ Payment form should appear
- ✅ Stripe payment fields should load

---

## 📋 What to Check in Browser Console

### Success Messages:
```
🚀 Sponsor page loaded
🔗 Opening browser: {...}
✅ Dog information loaded
📱 Using Capacitor Browser...
```

### Error Messages to Look For:
```
❌ Authentication error
❌ Failed to load dog information
❌ Failed to create payment intent
❌ Stripe not loaded
```

---

## 🔧 Manual Test Steps

1. **Open browser console** (F12)

2. **Navigate to payment page:**
   ```
   https://cloudrescuefoundation.org/sponsor.html?dogId=TEST&type=specific
   ```

3. **Check console output:**
   - Should see initialization messages
   - Check for any errors

4. **Set auth token:**
   ```javascript
   localStorage.setItem('authToken', 'YOUR_TOKEN');
   location.reload();
   ```

5. **Verify dog loads:**
   - Should see dog information displayed
   - Check Network tab for API calls

6. **Click "Continue to Payment":**
   - Payment form should appear
   - Stripe Elements should load

---

## 🎯 Next Steps

1. **Check browser console** for errors
2. **Verify auth token** is set
3. **Check Network tab** for failed API calls
4. **Try clicking** "Continue to Payment" button
5. **Share console errors** if form still doesn't appear

The payment form is designed to appear **only after clicking the button**, not immediately when the page loads!

