import { body, param, validationResult } from 'express-validator';

/**
 * Security-focused validation middleware using express-validator
 * This complements existing Mongoose validation by adding:
 * - XSS protection (sanitization)
 * - Input sanitization
 * - Request parameter validation
 * - Security headers validation
 */

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Validation failed:', errors.array());
    }
    
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Auth validation - focuses on security, not format (Mongoose handles format)
export const validateAuth = [
  // Sanitize email input to prevent XSS
  body('email')
    .trim()
    .normalizeEmail()
    .escape(),
    
  // Sanitize password (no escape as it's hashed)
  body('password')
    .trim(),
    
  // Additional security check for suspicious patterns
  body('email')
    .custom((value) => {
      // Block common injection patterns
      if (/[<>\"'%;()&+]/g.test(value)) {
        throw new Error('Email contains invalid characters');
      }
      return true;
    }),
];

// Registration validation - additional security checks
export const validateRegistration = [
  // Sanitize all user inputs
  body('username')
    .trim()
    .escape()
    .custom((value) => {
      // Additional security: block suspicious usernames
      const suspiciousPatterns = ['admin', 'root', 'system', 'null', 'undefined'];
      if (suspiciousPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
        throw new Error('Username contains reserved words');
      }
      return true;
    }),
    
  body('displayName')
    .trim()
    .escape(), // Prevent XSS in display names
    
  body('email')
    .trim()
    .normalizeEmail()
    .escape()
    .custom((value) => {
      // Block disposable email providers for security
      const disposableProviders = ['tempmail', '10minutemail', 'guerrillamail'];
      if (disposableProviders.some(provider => value.includes(provider))) {
        throw new Error('Disposable email addresses are not allowed');
      }
      return true;
    }),
    
  body('password')
    .trim()
    .custom((value) => {
      // Security check: block common weak passwords
      const weakPasswords = ['password', '123456', 'qwerty', 'admin'];
      if (weakPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common and insecure');
      }
      return true;
    }),
];

// Content validation - focuses on XSS prevention and sanitization
export const validateContent = [
  // Sanitize all text content to prevent XSS
  body('title')
    .trim()
    .escape()
    .custom((value) => {
      // Block script tags and suspicious patterns
      if (/<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Title contains forbidden content');
      }
      return true;
    }),
    
  body('description')
    .optional()
    .trim()
    .escape()
    .custom((value) => {
      if (value && /<script|javascript:|on\w+=/i.test(value)) {
        throw new Error('Description contains forbidden content');
      }
      return true;
    }),
    
  // Validate image URLs are from trusted sources
  body('imageUrl')
    .optional()
    .custom((value) => {
      if (value) {
        const allowedDomains = ['imagekit.io', 'ik.imagekit.io'];
        const url = new URL(value);
        if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
          throw new Error('Image must be from approved image service');
        }
      }
      return true;
    }),
    
  // Sanitize tags array
  body('tags')
    .optional()
    .customSanitizer((tags) => {
      if (Array.isArray(tags)) {
        return tags.map(tag => 
          typeof tag === 'string' ? 
          tag.trim().replace(/[<>\"'&]/g, '') : tag
        );
      }
      return tags;
    }),
];

// Comment validation - XSS protection for user comments
export const validateComment = [
  body('content')
    .trim()
    .escape()
    .custom((value) => {
      // Block malicious patterns in comments
      if (/<script|javascript:|on\w+=|<iframe|<object|<embed/i.test(value)) {
        throw new Error('Comment contains forbidden content');
      }
      // Block excessive caps (potential spam)
      const capsRatio = (value.match(/[A-Z]/g) || []).length / value.length;
      if (capsRatio > 0.7 && value.length > 10) {
        throw new Error('Comment contains too many capital letters');
      }
      return true;
    }),
];

// Separate comment validation with pin ID/slug validation
export const validateCommentWithPin = [
  body('content')
    .trim()
    .escape()
    .custom((value) => {
      // Block malicious patterns in comments
      if (/<script|javascript:|on\w+=|<iframe|<object|<embed/i.test(value)) {
        throw new Error('Comment contains forbidden content');
      }
      // Block excessive caps (potential spam)
      const capsRatio = (value.match(/[A-Z]/g) || []).length / value.length;
      if (capsRatio > 0.7 && value.length > 10) {
        throw new Error('Comment contains too many capital letters');
      }
      return true;
    }),
    
  // Flexible validation for pin ID (can be MongoDB ID or slug)
  param('pinId')
    .custom((value) => {
      // Allow MongoDB ObjectId format
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      // Allow slug format (lowercase letters, numbers, hyphens)
      const isSlug = /^[a-z0-9-]{3,100}$/.test(value);
      
      if (!isObjectId && !isSlug) {
        throw new Error('Invalid pin identifier. Must be MongoDB ID or valid slug');
      }
      return true;
    }),
];

// Message validation - prevent spam and malicious content
export const validateMessage = [
  body('content')
    .trim()
    .escape()
    .custom((value) => {
      // Block malicious patterns
      if (/<script|javascript:|on\w+=|<iframe/i.test(value)) {
        throw new Error('Message contains forbidden content');
      }
      // Block potential phishing patterns
      if (/click here|free money|urgent|winner|congratulations/i.test(value)) {
        throw new Error('Message appears to be spam');
      }
      return true;
    }),
];

// Parameter validation for routes - flexible ID/slug validation
export const validateMongoId = (paramName) => [
  param(paramName)
    .custom((value) => {
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        throw new Error(`Invalid ${paramName} format`);
      }
      return true;
    })
];

// Flexible validation for IDs that can be either MongoDB ObjectId or slug
export const validateIdOrSlug = (paramName) => [
  param(paramName)
    .custom((value) => {
      // Allow MongoDB ObjectId format
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      // Allow slug format (lowercase letters, numbers, hyphens)
      const isSlug = /^[a-z0-9-]{3,100}$/.test(value);
      
      if (!isObjectId && !isSlug) {
        throw new Error(`Invalid ${paramName} format. Must be MongoDB ID or valid slug`);
      }
      return true;
    })
];

// Strict MongoDB ID validation (for cases where only ObjectId is allowed)
export const validateStrictMongoId = (paramName) => [
  param(paramName)
    .custom((value) => {
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        throw new Error(`Invalid ${paramName} format`);
      }
      return true;
    })
];

// File upload validation
export const validateFileUpload = [
  body('file')
    .custom((value, { req }) => {
      if (req.file) {
        // Check file size (5MB limit)
        if (req.file.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit');
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type. Only images are allowed');
        }
        
        // Check file name for malicious patterns
        if (/[<>:"\/\\|?*\x00-\x1f]/.test(req.file.originalname)) {
          throw new Error('Filename contains invalid characters');
        }
      }
      return true;
    })
];