// Sponsor Payment Page JavaScript
// Handles payment processing, API calls, and redirects

// API Configuration
const API_CONFIG = {
  // Force mode: 'local' | 'dev' | 'prod' | null (auto-detect)
  _forceMode: null, // null = auto-detect, 'dev' = force DEV, 'prod' = force PROD
  
  // Detect if running on localhost for testing
  getBaseUrl: function() {
    // Check for forced mode first
    if (this._forceMode === 'dev') {
      return 'https://api-dev.cloudrescuefoundation.org/api';
    }
    if (this._forceMode === 'local') {
      return 'http://localhost:3000/dev/api';
    }
    if (this._forceMode === 'prod') {
      return 'https://api.cloudrescuefoundation.org/api';
    }
    
    // Auto-detect based on hostname
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      // For localhost testing - use DEV API (deployed) with Stripe test credentials
      // This allows testing without running local serverless offline
      return 'https://api-dev.cloudrescuefoundation.org/api';
      
      // Alternative: Use local API if serverless offline is running
      // return 'http://localhost:3000/dev/api';
    }
    // Production API
    return 'https://api.cloudrescuefoundation.org/api';
  },
  
  // Stripe publishable key - use test key for localhost/dev
  getStripeKey: function() {
    const hostname = window.location.hostname;
    // Use test key for localhost/dev (matches dev environment Stripe test key)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || this._forceMode === 'dev') {
      // Stripe test key (matches dev environment)
      return 'pk_test_51SF5KEAbSyf5IY0de7DTJAgqq6MOaxLBeJXe7wxjQYhVmofLIV5aTgqL6KBlPeoz5sw25gsTrkOMmNihwKKIyOJy00hkzR22ni';
    }
    // Production key - TODO: Replace with your production key when ready
    return 'pk_test_51SF5KEAbSyf5IY0de7DTJAgqq6MOaxLBeJXe7wxjQYhVmofLIV5aTgqL6KBlPeoz5sw25gsTrkOMmNihwKKIyOJy00hkzR22ni'; // Still using test for now
  },
  
  // Helper methods to force API mode
  forceDev: function() {
    this._forceMode = 'dev';
    console.log('🔧 Forced DEV API mode:', this.getBaseUrl());
  },
  forceLocal: function() {
    this._forceMode = 'local';
    console.log('🔧 Forced LOCAL API mode:', this.getBaseUrl());
  },
  forceProduction: function() {
    this._forceMode = 'prod';
    console.log('🔧 Forced PRODUCTION API mode:', this.getBaseUrl());
  },
  useLocal: function() {
    return this.forceLocal();
  }
};

// State management
let state = {
  dog: null,
  adoption: null,
  type: null,
  dogId: null,
  adoptionId: null,
  action: null,
  weeks: null,
  price: 0,
  duration: '',
  loading: false,
  error: null,
  userToken: null
};

// Process payment with Stripe - redirect directly to Stripe Checkout
// Declare BEFORE DOMContentLoaded so it's hoisted and available
async function processPayment() {
  try {
    console.log('💳 Starting payment process - redirecting to Stripe Checkout...');
    setLoading(true);
    hideError();
    
    // Create payment intent first (to get paymentIntentId for confirmation)
    console.log('📝 Creating payment intent...');
    const paymentData = await createPaymentIntent();
    console.log('✅ Payment intent created:', paymentData);
    
    if (!paymentData.payment || !paymentData.payment.paymentIntentId) {
      throw new Error('Failed to initialize payment - missing paymentIntentId');
    }
    
    const paymentIntentId = paymentData.payment.paymentIntentId;
    
    // Build success and cancel URLs
    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}/sponsor-success.html?paymentIntentId=${paymentIntentId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/sponsor.html${window.location.search}`;
    
    // Create checkout session
    console.log('🛒 Creating Stripe Checkout Session...');
    const checkoutResponse = await fetch(`${API_CONFIG.getBaseUrl()}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: state.price,
        paymentIntentId: paymentIntentId,
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        description: state.dog ? `Sponsor ${state.dog.name}` : 'Dog Sponsorship',
        metadata: {
          dogId: state.dogId || '',
          type: state.type || '',
          adoptionId: state.adoptionId || '',
          action: state.action || ''
        }
      })
    });
    
    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      let errorMessage = 'Failed to create checkout session';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      console.error('❌ Checkout session creation failed:', {
        status: checkoutResponse.status,
        statusText: checkoutResponse.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    const checkoutData = await checkoutResponse.json();
    console.log('✅ Checkout session created:', checkoutData);
    
    if (!checkoutData.url) {
      console.error('❌ No checkout URL in response:', checkoutData);
      throw new Error('Failed to get checkout URL from server');
    }
    
    // IMPORTANT: Make sure payment form container is hidden before redirect
    const paymentFormContainer = document.getElementById('payment-form-container');
    if (paymentFormContainer) {
      paymentFormContainer.classList.add('hidden');
    }
    
    // Redirect directly to Stripe Checkout (this should happen immediately)
    console.log('🔄 Redirecting to Stripe Checkout:', checkoutData.url);
    window.location.href = checkoutData.url;
    
    // Fallback: If redirect doesn't work, try after a short delay
    setTimeout(() => {
      if (window.location.href !== checkoutData.url) {
        console.warn('⚠️ Redirect did not occur, forcing redirect...');
        window.location.replace(checkoutData.url);
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Process payment error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      state: state
    });
    setLoading(false);
    showError(error.message || 'Failed to initialize payment. Please try again.');
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Sponsor page loaded');
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  state.dogId = urlParams.get('dogId');
  state.type = urlParams.get('type');
  state.adoptionId = urlParams.get('adoptionId');
  state.action = urlParams.get('action');
  state.weeks = urlParams.get('weeks');
  
  // Get token from URL parameter (from mobile app) or localStorage
  const tokenFromUrl = urlParams.get('token');
  if (tokenFromUrl) {
    console.log('🔑 Token found in URL parameter, storing in localStorage');
    localStorage.setItem('authToken', tokenFromUrl);
    state.userToken = tokenFromUrl;
    // Remove token from URL for security
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('token');
    window.history.replaceState({}, '', newUrl.toString());
  } else {
    state.userToken = localStorage.getItem('authToken');
  }
  
  console.log('🔐 Auth token status:', state.userToken ? 'Found' : 'Not found');
  
  // Expose helper functions to window for browser console testing and payment processing
  // Note: processPayment will be added after the function is declared
  window.sponsorPayment = {
    // Token management
    setToken: (token) => {
      localStorage.setItem('authToken', token);
      state.userToken = token;
      console.log('✅ Auth token set! Reload page or continue.');
      return true;
    },
    getToken: () => {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'Not set');
      return token;
    },
    clearToken: () => {
      localStorage.removeItem('authToken');
      state.userToken = null;
      console.log('✅ Auth token cleared');
      return true;
    },
    
    // API configuration
    useProductionAPI: () => API_CONFIG.forceProduction(),
    useLocalAPI: () => API_CONFIG.useLocal(),
    getAPIUrl: () => {
      const url = API_CONFIG.getBaseUrl();
      console.log('Current API URL:', url);
      return url;
    },
    
    // Utility
    reload: () => window.location.reload(),
    
    // State access (for debugging)
    getState: () => {
      console.log('Current state:', state);
      return state;
    },
    
    // Payment processing function - directly reference the hoisted function
    // Function declarations are hoisted, so processPayment is available here
    processPayment: processPayment
  };
  
  // Ensure processPayment is attached immediately
  window.sponsorPayment.processPayment = processPayment;
  console.log('✅ window.sponsorPayment object created with processPayment method');
  console.log('✅ processPayment function type:', typeof window.sponsorPayment.processPayment);
  
  console.log('💡 Testing helpers available:');
  console.log('  - sponsorPayment.setToken("YOUR_TOKEN") - Set auth token');
  console.log('  - sponsorPayment.getToken() - View current token');
  console.log('  - sponsorPayment.useProductionAPI() - Force production API');
  console.log('  - sponsorPayment.getAPIUrl() - View current API URL');
  console.log('  - sponsorPayment.processPayment() - Process payment');
  console.log('  - sponsorPayment.reload() - Reload page');
  
  // Try to verify auth, but don't block page loading if it fails
  // The payment creation will validate auth anyway
  try {
    const authValid = await checkAuth();
    if (!authValid) {
      console.warn('⚠️ Auth check failed, but continuing to show page. Auth will be verified during payment.');
      console.log('💡 Tip: Use sponsorPayment.setToken("YOUR_TOKEN") to set your auth token');
    }
  } catch (error) {
    console.warn('⚠️ Auth check error, but continuing:', error);
  }
  
  // Load data based on sponsorship type (even if auth check failed)
  try {
    if (state.adoptionId && state.action === 'renew') {
      await loadRenewalData();
    } else if (state.type === 'random') {
      await loadRandomSponsorship();
    } else if (state.dogId && state.type) {
      await loadDogSponsorship();
    } else {
      showError('Invalid sponsorship parameters. Please try again from the app.');
    }
  } catch (error) {
    console.error('❌ Error loading sponsorship data:', error);
    showError('Failed to load sponsorship information. Please try again.');
  }
});

// Check authentication (non-blocking - doesn't redirect, just validates)
async function checkAuth() {
  if (!state.userToken) {
    console.warn('⚠️ No auth token found');
    // Don't redirect immediately - allow page to show, auth will be checked during payment
    return false;
  }
  
  // Verify token is valid
  try {
    const response = await fetch(`${API_CONFIG.getBaseUrl()}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${state.userToken}`
      }
    });
    
    if (!response.ok) {
      console.warn('⚠️ Auth token invalid, removing from storage');
      localStorage.removeItem('authToken');
      state.userToken = null;
      // Don't redirect - allow user to see page, payment will fail with auth error
      return false;
    }
    
    console.log('✅ Auth token verified');
    return true;
  } catch (error) {
    console.warn('⚠️ Auth check error (network issue?):', error);
    // Don't redirect on network errors - allow user to try payment anyway
    return false;
  }
}

// Load dog sponsorship data
async function loadDogSponsorship() {
  try {
    setLoading(true);
    console.log('🐕 Loading dog information...', { dogId: state.dogId });
    
    // Fetch dog information from public endpoint
    const dogUrl = `${API_CONFIG.getBaseUrl()}/public/dogs/${state.dogId}`;
    console.log('🌐 Fetching dog from:', dogUrl);
    
    const response = await fetch(dogUrl);
    console.log('📡 Dog fetch response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dog fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to load dog information (HTTP ${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Dog data received:', data);
    
    // Handle both direct dog object and wrapped {dog: {...}} format
    state.dog = data.dog || data;
    
    // Calculate price based on type
    if (state.type === 'specific') {
      state.price = 59.99;
      state.duration = '5 weeks';
    } else if (state.type === 'sized') {
      const size = state.dog.size || state.dog.breed?.size;
      if (size === 'SMALL') {
        state.price = 9.99;
      } else if (size === 'MEDIUM') {
        state.price = 15.99;
      } else {
        state.price = 20.99;
      }
      state.duration = 'per week';
    }
    
    displaySponsorshipInfo();
    setLoading(false);
  } catch (error) {
    console.error('❌ Load dog error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      dogId: state.dogId,
      apiUrl: API_CONFIG.getBaseUrl()
    });
    showError(error.message || 'Failed to load dog information. Please try again.');
    setLoading(false);
  }
}

// Load random sponsorship data
async function loadRandomSponsorship() {
  state.price = 9.90;
  state.duration = 'per week';
  displayRandomSponsorship();
}

// Load renewal data
async function loadRenewalData() {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_CONFIG.getBaseUrl()}/adoptions/${state.adoptionId}`, {
      headers: {
        'Authorization': `Bearer ${state.userToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load adoption information');
    }
    
    state.adoption = await response.json();
    const weeks = parseInt(state.weeks) || 1;
    state.price = (state.adoption.weeklyFee || 9.90) * weeks;
    state.duration = `${weeks} week${weeks > 1 ? 's' : ''}`;
    
    displayRenewalInfo();
    setLoading(false);
  } catch (error) {
    console.error('Load renewal error:', error);
    showError('Failed to load adoption information. Please try again.');
    setLoading(false);
  }
}

// Display sponsorship information
function displaySponsorshipInfo() {
  const container = document.getElementById('sponsor-info');
  if (!container || !state.dog) return;
  
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        ${state.dog.primaryImageUrl ? `
          <img src="${state.dog.primaryImageUrl}" alt="${state.dog.name}" class="w-full h-64 object-cover">
        ` : ''}
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Sponsor ${state.dog.name}</h2>
          <div class="space-y-3 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Breed:</span>
              <span class="font-semibold">${state.dog.breed || 'Mixed'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Age:</span>
              <span class="font-semibold">${state.dog.age || 'Unknown'} years</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Size:</span>
              <span class="font-semibold">${state.dog.size || 'Unknown'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shelter:</span>
              <span class="font-semibold">${state.dog.shelterId?.name || 'Unknown'}</span>
            </div>
          </div>
          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-bold text-gray-900">Total Amount</span>
              <span class="text-3xl font-bold text-primary">$${state.price.toFixed(2)}</span>
            </div>
            <p class="text-gray-600 text-sm">for ${state.duration}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Display random sponsorship
function displayRandomSponsorship() {
  const container = document.getElementById('sponsor-info');
  if (!container) return;
  
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Sponsor a Random Dog</h2>
        <p class="text-gray-600 mb-6">We'll match you with a dog in need of sponsorship!</p>
        <div class="border-t pt-4">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xl font-bold text-gray-900">Weekly Amount</span>
            <span class="text-3xl font-bold text-primary">$${state.price.toFixed(2)}</span>
          </div>
          <p class="text-gray-600 text-sm">${state.duration}</p>
        </div>
      </div>
    </div>
  `;
}

// Display renewal information
function displayRenewalInfo() {
  const container = document.getElementById('sponsor-info');
  if (!container || !state.adoption) return;
  
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Renew Sponsorship</h2>
        <p class="text-gray-600 mb-6">Extend your sponsorship for ${state.weeks} more week${state.weeks > 1 ? 's' : ''}.</p>
        <div class="border-t pt-4">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xl font-bold text-gray-900">Total Amount</span>
            <span class="text-3xl font-bold text-primary">$${state.price.toFixed(2)}</span>
          </div>
          <p class="text-gray-600 text-sm">for ${state.duration}</p>
        </div>
      </div>
    </div>
  `;
}

// Create payment intent
async function createPaymentIntent() {
  try {
    console.log('💳 Creating payment intent...');
    console.log('🔐 Auth token:', state.userToken ? state.userToken.substring(0, 20) + '...' : 'MISSING!');
    console.log('📋 State:', { 
      adoptionId: state.adoptionId, 
      action: state.action, 
      type: state.type, 
      dogId: state.dogId,
      weeks: state.weeks
    });
    
    if (!state.userToken) {
      const errorMsg = 'Authentication required. Please set your auth token.';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    setLoading(true);
    let endpoint;
    const apiUrl = API_CONFIG.getBaseUrl();
    console.log('🌐 API URL:', apiUrl);
    
    if (state.adoptionId && state.action === 'renew') {
      // Renewal
      endpoint = `${apiUrl}/adoptions/${state.adoptionId}/renew`;
      console.log('🔄 Renewal endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weeks: parseInt(state.weeks) })
      });
      
      console.log('📡 Renewal response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Renewal API error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(error.message || 'Failed to create renewal payment');
      }
      
      const result = await response.json();
      console.log('✅ Renewal payment intent created:', result);
      return result;
    } else {
      // New sponsorship
      let endpoint;
      let body = {};
      
      if (state.type === 'specific') {
        endpoint = `${apiUrl}/adoptions/specific`;
        body = { dogId: state.dogId };
      } else if (state.type === 'sized') {
        endpoint = `${apiUrl}/adoptions/sized`;
        body = { dogId: state.dogId };
      } else if (state.type === 'random') {
        endpoint = `${apiUrl}/adoptions/random`;
        body = {}; // No body needed for random
      } else {
        throw new Error('Invalid sponsorship type');
      }
      
      console.log('📝 Sponsorship endpoint:', endpoint);
      console.log('📝 Request body:', body);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      console.log('📡 Sponsorship response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Sponsorship API error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        const errorMsg = error.message || `Failed to create payment intent (HTTP ${response.status})`;
        console.error('❌ Error details:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMsg,
          hasToken: !!state.userToken
        });
        throw new Error(errorMsg);
      }
      
      const result = await response.json();
      console.log('✅ Payment intent created:', result);
      return result;
    }
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}

// Note: processPayment function is now declared BEFORE DOMContentLoaded (see line 49)
// This duplicate declaration has been removed

// Confirm payment and adoption
async function confirmPayment(paymentIntentId) {
  try {
    setLoading(true);
    
    let endpoint;
    if (state.adoptionId && state.action === 'renew') {
      // Confirm renewal
      endpoint = `${API_CONFIG.getBaseUrl()}/adoptions/${state.adoptionId}/confirm-renewal`;
    } else {
      // Confirm adoption
      endpoint = `${API_CONFIG.getBaseUrl()}/adoptions/confirm`;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentIntentId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }
    
    const data = await response.json();
    const adoptionId = data.adoption?.id || data.adoptionId || state.adoptionId;
    const isRenewal = state.action === 'renew';
    
    // Redirect to app
    redirectToApp(adoptionId, isRenewal);
  } catch (error) {
    console.error('Confirm payment error:', error);
    showError(error.message || 'Failed to confirm payment. Please contact support.');
    setLoading(false);
  }
}

// Redirect back to mobile app
function redirectToApp(adoptionId, isRenewal = false) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    let deepLinkUrl;
    
    if (isIOS) {
      deepLinkUrl = `org.cloudrescuefoundation.ios://sponsor-success?adoptionId=${adoptionId}${isRenewal ? '&renewal=true' : ''}`;
    } else if (isAndroid) {
      deepLinkUrl = `intent://sponsor-success?adoptionId=${adoptionId}${isRenewal ? '&renewal=true' : ''}#Intent;scheme=org.cloudrescuefoundation.app;package=org.cloudrescuefoundation.app;end`;
    }
    
    // Try to open app
    window.location.href = deepLinkUrl;
    
    // Fallback: Show instructions if app doesn't open within 2 seconds
    setTimeout(() => {
      showReturnInstructions(isRenewal);
    }, 2000);
  } else {
    // Desktop user - redirect to success page
    window.location.href = `/sponsor-success.html?adoptionId=${adoptionId}&renewal=${isRenewal}`;
  }
}

// Show return instructions
function showReturnInstructions(isRenewal) {
  const message = `✅ Payment Successful!\n\n` +
    (isRenewal 
      ? 'Your sponsorship has been renewed successfully!' 
      : 'Your sponsorship has been confirmed!') +
    `\n\nPlease return to the Cloud Rescue app to view your adoption.\n\n` +
    `You can close this browser tab and go back to the app.`;
  
  alert(message);
}

// UI Helper functions
function setLoading(loading) {
  state.loading = loading;
  const button = document.getElementById('continue-button');
  const formButton = document.getElementById('submit-payment');
  
  if (button) {
    button.disabled = loading;
    button.innerHTML = loading ? 
      '<span class="spinner"></span> Processing...' : 
      'Continue to Payment';
  }
  
  if (formButton) {
    formButton.disabled = loading;
    formButton.innerHTML = loading ? 
      '<span class="spinner"></span> Processing...' : 
      'Complete Payment';
  }
}

function showError(message) {
  state.error = message;
  console.error('🚨 Showing error to user:', message);
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function hideError() {
  state.error = null;
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

// Ensure processPayment is attached to window.sponsorPayment
// This runs after all code is parsed, so the function is guaranteed to exist
(function() {
  function attachProcessPayment() {
    if (window.sponsorPayment && typeof processPayment === 'function') {
      window.sponsorPayment.processPayment = processPayment;
      console.log('✅ processPayment attached to window.sponsorPayment (IIFE)');
      console.log('✅ Function available:', typeof window.sponsorPayment.processPayment);
      return true;
    }
    console.warn('⚠️ processPayment not ready yet:', {
      hasObject: !!window.sponsorPayment,
      hasFunction: typeof processPayment
    });
    return false;
  }
  
  // Try immediately
  if (!attachProcessPayment()) {
    // If not ready, wait for DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(attachProcessPayment, 50);
        setTimeout(attachProcessPayment, 200);
        setTimeout(attachProcessPayment, 500);
      });
    } else {
      // DOM already loaded, try multiple times
      setTimeout(attachProcessPayment, 50);
      setTimeout(attachProcessPayment, 200);
      setTimeout(attachProcessPayment, 500);
      setTimeout(attachProcessPayment, 1000);
    }
  }
})();

// Also attach directly at end of script execution
if (typeof processPayment === 'function' && window.sponsorPayment) {
  window.sponsorPayment.processPayment = processPayment;
  console.log('✅ processPayment directly assigned at end of file');
}

// Also attach directly at end of script execution
if (typeof processPayment === 'function' && window.sponsorPayment) {
  window.sponsorPayment.processPayment = processPayment;
  console.log('✅ processPayment directly assigned at end of file');
}

