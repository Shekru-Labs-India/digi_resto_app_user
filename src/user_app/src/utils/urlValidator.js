// Regular expressions for URL validation
export const URL_PATTERNS = {
  // Base path pattern - must be exactly "/user_app/"
  correctBasePath: /^\/user_app\//,
  
  // Valid URL pattern for restaurant URLs with proper prefixes
  validUrlPattern: /^\/user_app\/o(\d+)(?:\/s(\d+))?(?:\/t(\d+))?(?:\/)?$/,
  
  // Pattern to detect old format without prefixes
  // Example: /user_app/123/456/789
  oldFormatPattern: /^\/user_app\/\d+\/\d+\/\d+$/,
  
  // Pattern to detect missing outlet prefix 
  // Example: /user_app/622050/ (missing 'o' prefix)
  missingOutletPrefixPattern: /^\/user_app\/\d+\/?$/,
  
  // Similar to user_app pattern - to catch typos like "user_a"
  similarBasePath: /^\/user_a(?:pp)?|\/user[_-]ap(?:p)?|\/usr_app/,
  
  // Patterns to detect bad prefixes
  // Example: /user_app/oabc/... (non-numeric after 'o')
  badOutletPattern: /\/user_app\/o[^\/\d][^\/]*/,
  // Example: /user_app/o123/sxyz/... (non-numeric after 's')
  badSectionPattern: /\/s[^\/\d][^\/]*/,
  // Example: /user_app/o123/s456/tabc/... (non-numeric after 't')
  badTablePattern: /\/t[^\/\d][^\/]*/,
  
  // Pattern for outlet-only URL (no section/table)
  // Example: /user_app/o123 or /user_app/o123/
  outletOnlyPattern: /^\/user_app\/o\d+\/?$/
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
  // First check if the path uses a similar but incorrect base path
  if (URL_PATTERNS.similarBasePath.test(path) && !URL_PATTERNS.correctBasePath.test(path)) {
    return "Incorrect application path. Please use the correct URL format: /user_app/...";
  }
  
  // If it doesn't include the user_app path at all, don't validate further
  if (!path.includes('/user_app/')) return null;
  
  // Check for old URL format (without prefixes)
  if (URL_PATTERNS.oldFormatPattern.test(path)) {
    return "The link format has changed. Please scan the QR code again or ask for assistance.";
  }
  
  // Check for missing outlet prefix in an outlet-only URL
  if (URL_PATTERNS.missingOutletPrefixPattern.test(path) && !path.includes('/user_app/o')) {
    return "Missing outlet prefix. Please use the format: /user_app/o[outlet-number]";
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