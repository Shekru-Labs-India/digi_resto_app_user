// Regular expressions for URL validation
export const URL_PATTERNS = {
  // Base path pattern - must be exactly "/user_app/"
  correctBasePath: /^\/user_app\//,
  
  // Valid URL pattern for restaurant URLs with proper prefixes
  validUrlPattern: /^\/user_app\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?(?:\/)?$/,
  
  // NEW: Pattern for direct /o[outlet] URLs without /user_app/ prefix
  directOutletPattern: /^\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?(?:\/)?$/,
  
  // Pattern to detect old format without prefixes
  // Example: /user_app/123/456/789
  oldFormatPattern: /^\/user_app\/\d+\/\d+\/\d+$/,
  
  // Pattern to detect completely invalid table format (non-numeric characters)
  // Example: /user_app/622050/144/1h
  invalidTableFormatPattern: /^\/user_app\/\d+\/\d+\/[^\/]*[^\d\/][^\/]*$/,
  
  // Pattern to detect missing outlet prefix but with s/t prefixes
  // Example: /user_app/622050/s144/t1 (missing 'o' prefix but has s/t)
  missingOutletPrefixWithSectionTablePattern: /^\/user_app\/(\d+)\/s(\d+)\/t(\d+)(?:\/)?$/,
  
  // Pattern to detect missing all prefixes but still 3 parts
  // Example: /user_app/622050/144/1
  allPrefixesMissingPattern: /^\/user_app\/(\d+)\/(\d+)\/(\d+)(?:\/)?$/,
  
  // Pattern to detect missing outlet prefix 
  // Example: /user_app/622050/ (missing 'o' prefix)
  missingOutletPrefixPattern: /^\/user_app\/\d+\/?$/,
  
  // Similar to user_app pattern - to catch typos like "user_a"
  similarBasePath: /^\/user_a(?:pp)?|\/user[_-]ap(?:p)?|\/usr_app/,

  // Pattern to detect outlet-like structure but with wrong base path
  // Example: /sjhfshhsabf/o622050/s144/t1 - has o/s/t structure but wrong base path
  wrongBasePathWithStructure: /^\/(?!user_app\/)[^\/]+\/o\d+(?:\/s\d+)?(?:\/t\d+)?(?:\/)?$/,
  
  // Patterns to detect bad prefixes
  // Example: /user_app/oabc/... (non-numeric after 'o')
  badOutletPattern: /\/user_app\/o[^\/\d][^\/]*/,
  // Example: /user_app/o123/sxyz/... (non-numeric after 's')
  badSectionPattern: /\/s[^\/\d][^\/]*/,
  // Example: /user_app/o123/s456/tabc/... (non-numeric after 't')
  badTablePattern: /\/t[^\/\d][^\/]*/,
  
  // Pattern for outlet-only URL (no section/table)
  // Example: /user_app/o123 or /user_app/o123/
  outletOnlyPattern: /^\/user_app\/o\d+\/?$/,
  
  // NEW: Pattern to catch invalid extra slash after section or table prefix
  // Example: /user_app/225827/s/12 or /user_app/o225827/s/12
  extraSlashAfterPrefixPattern: /\/user_app\/(?:o)?(?:\d+)\/s\/|\/user_app\/(?:o)?(?:\d+)(?:\/s\d+)?\/t\//,

  // NEW: Pattern to detect missing table number after /t
  // Example: /user_app/o225827/s202/t
  missingTableNumberPattern: /^\/user_app\/o\d+(?:\/s\d+)?\/t\/?$/
};

// Helper to strip prefixes
export const stripPrefix = (value, prefix) => {
  if (!value) return value;
  return value.toString().replace(new RegExp(`^${prefix}`), '');
};

// Extract parameters from URL path
export const extractUrlParams = (path) => {
  const match = path.match(URL_PATTERNS.validUrlPattern);
  if (!match) return null;
  
  const [, code, section, table] = match;
  return {
    outletCode: stripPrefix(code, 'o'),
    sectionId: section ? stripPrefix(section, 's') : null,
    tableNumber: table ? stripPrefix(table, 't') : null
  };
};

// Validate URL path and return error message if invalid
export const validateUrlPath = (path) => {
  // NEW: Handle direct /o[outlet] URLs without /user_app/ prefix
  if (URL_PATTERNS.directOutletPattern.test(path)) {
    return "Invalid URL format. URLs should include '/user_app/' prefix.";
  }

  // Check for completely wrong base path but with outlet structure
  if (URL_PATTERNS.wrongBasePathWithStructure.test(path)) {
    return "Incorrect application path. The URL should begin with '/user_app/'.";
  }
  
  // First check if the path uses a similar but incorrect base path
  if (URL_PATTERNS.similarBasePath.test(path) && !URL_PATTERNS.correctBasePath.test(path)) {
    return "Incorrect application path. Did you mean '/user_app/'?";
  }
  
  // Check for any URL that has outlet-like format but doesn't have user_app
  // This needs to come after the specific wrong base path checks
  if (path.match(/^\/[^\/]+\/o\d+/) && !path.startsWith('/user_app/')) {
    return "Incorrect application path. The URL should begin with '/user_app/'.";
  }
  
  // If it doesn't include the user_app path at all, don't validate further
  if (!path.includes('/user_app/')) return null;

  // NEW: Check for missing table number after /t
  // This needs to be checked before other table-related validations
  if (URL_PATTERNS.missingTableNumberPattern.test(path)) {
    return "Table having issue. Rescan the QR Code again!";
  }
  
  // NEW: Check for extra slash after section or table prefix
  // This catches patterns like /user_app/225827/s/12 or /user_app/225827/s/t
  if (URL_PATTERNS.extraSlashAfterPrefixPattern.test(path)) {
    return "Invalid URL format. Section or table identifiers must not have an extra slash after the prefix.";
  }
  
  // Special check for URLs with non-numeric characters in section part but without 's' prefix
  // This handles cases like /user_app/225827/2fddhg16/t16
  if (path.startsWith('/user_app/') && !path.startsWith('/user_app/o')) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 3 && segments[0] === 'user_app') {
      // Check if section part (segments[2]) contains non-numeric characters but is not prefixed with 's'
      if (segments.length >= 3 && !segments[2].startsWith('s') && /[a-zA-Z]/.test(segments[2])) {
        return "Outlet having issue. Rescan the QR Code again!";
      }
      
      // Check if table part (segments[3]) contains non-numeric characters but is not prefixed with 't'
      if (segments.length >= 4 && !segments[3].startsWith('t') && /[a-zA-Z]/.test(segments[3])) {
        return "Table having issue. Rescan the QR Code again!";
      }
    }
  }
  
  // Check for table format with non-numeric characters
  if (URL_PATTERNS.invalidTableFormatPattern.test(path)) {
    return "Table having issue. Rescan the QR Code again!";
  }
  
  // Check for old URL format without any prefixes but has 3 parts
  if (URL_PATTERNS.allPrefixesMissingPattern.test(path)) {
    return "This QR code link is outdated. Please scan the new QR code on your table or ask restaurant staff for assistance.";
  }
  
  // Check for old URL format (without prefixes)
  if (URL_PATTERNS.oldFormatPattern.test(path)) {
    return "The link format has changed. Please scan the QR code again or ask for assistance.";
  }
  
  // Check for missing outlet prefix but with section/table
  if (URL_PATTERNS.missingOutletPrefixWithSectionTablePattern.test(path)) {
    return "Sorry, this link appears to be incorrect. Please scan the QR code again or ask for assistance.";
  }
  
  // Check for missing outlet prefix in an outlet-only URL
  if (URL_PATTERNS.missingOutletPrefixPattern.test(path) && !path.includes('/user_app/o')) {
    return "Sorry, this link appears to be incomplete. Please scan the QR code again or ask restaurant staff for assistance";
  }
  
  // Only validate restaurant-specific URLs
  if (path.includes('/user_app/o')) {
    // Check for bad prefixes
    if (URL_PATTERNS.badOutletPattern.test(path)) {
      return "Sorry, this restaurant link appears to be incorrect. Please check and try again.";
    }
    
    if (URL_PATTERNS.badSectionPattern.test(path)) {
      return "Sorry, this section link appears to be incorrect. Please check and try again.";
    }
    
    if (URL_PATTERNS.badTablePattern.test(path)) {
      return "Sorry, this table link appears to be incorrect. Please check and try again.";
    }
    
    // Check if the URL matches the valid pattern
    if (!URL_PATTERNS.validUrlPattern.test(path)) {
      return "Sorry, this link appears to be incorrect. Please scan the QR code again or ask for assistance.";
    }
  }
  
  return null; // URL is valid
};

// Helper to check if a URL is an outlet-only URL
export const isOutletOnlyUrl = (path) => {
  return URL_PATTERNS.outletOnlyPattern.test(path);
};

// This can be used for testing the URL validator
// Uncomment and use in a development environment to verify patterns
/*
export const testUrlValidator = () => {
  const testUrls = [
    // Valid URLs
    { url: '/user_app/o622050/', expected: null, desc: 'Valid outlet-only URL' },
    { url: '/user_app/o622050/s144/t1', expected: null, desc: 'Valid URL with section and table' },
    { url: '/user_app/o622050/t1', expected: null, desc: 'Valid URL with outlet and table only' },
    
    // Invalid URLs
    { url: '/user_app/622050/144/1', expected: 'error', desc: 'URL without prefixes' },
    { url: '/user_app/622050/s144/t1', expected: 'error', desc: 'URL with missing outlet prefix' },
    { url: '/user_app/o62abc50/s144/t1', expected: 'error', desc: 'URL with invalid characters in outlet' },
    { url: '/user_app/o622050/s1abc44/t1', expected: 'error', desc: 'URL with invalid characters in section' },
    { url: '/user_app/o622050/s144/t1abc', expected: 'error', desc: 'URL with invalid characters in table' },
    { url: '/user_app/225827/2fddhg16/t16', expected: 'error', desc: 'URL with missing outlet prefix and invalid section' },
    { url: '/user_app/225827/144/1abc', expected: 'error', desc: 'URL with missing prefixes and invalid table' },
  ];
  
  console.log('===== URL VALIDATOR TEST =====');
  testUrls.forEach(test => {
    const error = validateUrlPath(test.url);
    const result = error === null ? 'VALID' : 'INVALID';
    const expected = test.expected === null ? 'VALID' : 'INVALID';
    const pass = (result === expected) ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${pass} | ${test.desc} | ${test.url}`);
    if (result !== expected) {
      console.log(`  Expected: ${expected}, Got: ${result}, Error: ${error}`);
    }
    
    // Also test outlet-only detection for valid URLs
    if (error === null) {
      const isOutletOnly = isOutletOnlyUrl(test.url);
      console.log(`  Is outlet-only: ${isOutletOnly}`);
    }
  });
  console.log('===== END TEST =====');
  
  return 'Test complete';
};
*/ 