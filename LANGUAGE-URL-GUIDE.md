# Language URL Parameter Guide

## Overview
The Cloud Rescue website now supports language selection via URL parameters, making it easy to share links in specific languages.

## Usage

### URL Parameters

You can now append language parameters to any page URL:

- **English**: `?lang=en`
- **Chinese**: `?lang=cn` or `?lang=zh`

### Examples

```
https://cloudrescuefoundation.org/?lang=en
https://cloudrescuefoundation.org/?lang=cn
https://cloudrescuefoundation.org/about.html?lang=en
https://cloudrescuefoundation.org/faq.html?lang=cn
```

## How It Works

### Priority Order

The website determines language in the following priority:

1. **URL Parameter** (highest priority) - `?lang=en` or `?lang=cn`
2. **Saved Preference** - Previously selected language stored in browser
3. **Browser Language** - Automatic detection based on browser settings

### Language Toggle Button

When users manually switch languages using the toggle button:
- The URL automatically updates to reflect the selected language
- The preference is saved in browser localStorage
- The URL parameter helps maintain language preference when sharing links

### Supported Languages

- `en` - English
- `cn` or `zh` - Chinese (Simplified)

Note: Both `cn` and `zh` are accepted for Chinese, but URLs will display `cn` for simplicity.

## Technical Details

### Implementation
- Modified `js/language.js` to check URL parameters on initialization
- URL parameters take precedence over all other language settings
- When users manually switch languages, the URL is updated via `window.history.pushState()`
- Invalid language codes default to saved/browser language

### Browser Support
- Works in all modern browsers that support:
  - `URLSearchParams`
  - `window.history.pushState()`
  - ES6 features

## Use Cases

1. **Marketing Campaigns**: Share links with specific language for target audiences
2. **Email Newsletters**: Direct users to content in their preferred language
3. **Social Media**: Share language-specific links
4. **Documentation**: Link to specific language versions
5. **Customer Support**: Send users to help pages in their language

## Testing

Visit these URLs to test:
- English: https://cloudrescuefoundation.org/?lang=en
- Chinese: https://cloudrescuefoundation.org/?lang=cn

