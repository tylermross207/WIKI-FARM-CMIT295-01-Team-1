/**
 * Security utilities for input sanitization and validation
 */

/**
 * Remove HTML tags and JavaScript from input
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
function stripHtmlTags(input) {
  if (!input) return '';
  
  // Remove all HTML tags
  let cleaned = input.replace(/<[^>]*>/g, '');
  
  // Remove common JavaScript patterns
  cleaned = cleaned.replace(/javascript:/gi, '');
  cleaned = cleaned.replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=, onerror=, etc.
  cleaned = cleaned.replace(/eval\(/gi, '');
  cleaned = cleaned.replace(/expression\(/gi, '');
  
  // Remove HTML entities that could be used for attacks
  cleaned = cleaned.replace(/&#?\w+;/g, '');
  
  return cleaned.trim();
}

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (!input) return '';
  
  // HTML escape special characters
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return input.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format (3-20 chars, alphanumeric + underscore)
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid username format
 */
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Check if input contains suspicious patterns
 * @param {string} input - The input to check
 * @returns {boolean} - True if suspicious
 */
function isSuspiciousInput(input) {
  if (!input) return false;
  
  const suspiciousPatterns = [
    /union\s+select/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /drop\s+table/gi,
    /execute\s*\(/gi,
    /script/gi,
    /onclick/gi,
    /onerror/gi,
    /onload/gi
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

module.exports = {
  stripHtmlTags,
  sanitizeInput,
  isValidEmail,
  isValidUsername,
  isSuspiciousInput
};
