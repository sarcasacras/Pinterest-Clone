import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { validateEnvironment } from "./utils/validateEnv.js";
import connectDB from "./utils/db.js";
import pinsRouter from "./routes/pins.js";
import commentsRouter from "./routes/comments.js";
import boardsRouter from "./routes/boards.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import notificationsRouter from "./routes/notifications.js";
import messagesRouter from "./routes/messages.js";
import cookieParser from "cookie-parser";

// Validate environment variables first
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Railway.app and other cloud providers
// This allows express-rate-limit to properly identify users behind proxies
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

connectDB();

// Security headers with helmet
app.use(helmet({
  // Content Security Policy - allows ImageKit and frontend domain
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:", "*.imagekit.io"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  // Cross-Origin Embedder Policy - production ready setting
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? 
    { policy: "require-corp" } : false,
  // Cross-Origin Resource Policy - environment-specific
  crossOriginResourcePolicy: { 
    policy: process.env.NODE_ENV === 'production' ? "same-site" : "cross-origin" 
  },
  // HTTP Strict Transport Security - force HTTPS in production
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  // Disable X-Powered-By header
  hidePoweredBy: true,
  // Prevent MIME type sniffing
  noSniff: true,
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  // XSS Protection
  xssFilter: true,
  // Referrer Policy
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // Cross-Origin Opener Policy - prevents cross-origin attacks
  crossOriginOpenerPolicy: { policy: "same-origin" },
  // Permissions Policy - restrict dangerous features
  permissionsPolicy: {
    geolocation: [],
    camera: [],
    microphone: [],
    payment: []
  }
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Default Vite port
  'http://localhost:5174', // Alternative port when 5173 is busy
  // Production domains
  'https://pinterest-clone-nine-nu.vercel.app',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origins in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚫 CORS blocked origin: ${origin}`);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours preflight cache
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false
};

app.use(cors(corsOptions));

// Rate Limiting Configuration
const createRateLimiter = (windowMs, max, message, skipSuccessfulRequests = false, method = null) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests, // Don't count successful requests
    skip: (req) => {
      // Skip rate limiting in test environment
      if (process.env.NODE_ENV === 'test') {
        return true;
      }
      // Skip if method filter is set and doesn't match
      if (method && req.method !== method) {
        return true;
      }
      return false;
    },
    handler: (req, res) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚫 Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.path}`);
      }
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Separate rate limiters for different types of operations

// Generous rate limiter for GET requests (browsing, reading)
const readOnlyLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5000, // 5000 GET requests per 15 minutes per IP (realistic for active browsing)
  'Too many read requests from this IP, please slow down',
  false,
  'GET' // Only apply to GET requests
);

// Moderate rate limiter for non-critical write operations
const writeOperationsLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // 200 write operations per 15 minutes per IP
  'Too many write requests from this IP, please slow down'
);

// Strict rate limiter for authentication endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per 15 minutes per IP
  'Too many authentication attempts, please try again later',
  true // Don't count successful authentications
);

// Upload rate limiter for content creation (excludes GET requests)
const uploadLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  50, // 50 uploads per hour per IP
  'Upload limit reached, please wait before uploading more content',
  false, // Don't skip successful requests
  null // Apply to all methods, but we'll filter in middleware below
);

// Middleware to apply upload limits only to non-GET requests
const uploadOnlyLimiter = (req, res, next) => {
  // Skip upload limiting for GET requests (they use readOnlyLimiter)
  if (req.method === 'GET') {
    return next();
  }
  return uploadLimiter(req, res, next);
};

// Comment/interaction rate limiter  
const interactionLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  50, // 50 interactions per 5 minutes per IP (increased from 30)
  'Too many interactions, please slow down'
);

// Middleware to apply interaction limits only to non-GET requests
const interactionOnlyLimiter = (req, res, next) => {
  // Skip interaction limiting for GET requests (they use readOnlyLimiter)
  if (req.method === 'GET') {
    return next();
  }
  return interactionLimiter(req, res, next);
};

// Message rate limiter for write operations only
const messageLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  15, // 15 messages per minute per IP (increased from 10)
  'Too many messages sent, please wait before sending more'
);

// Middleware to apply message limits only to non-GET requests
const messageOnlyLimiter = (req, res, next) => {
  // Skip message limiting for GET requests (they use readOnlyLimiter)
  if (req.method === 'GET') {
    return next();
  }
  return messageLimiter(req, res, next);
};

// Apply read-only rate limiting to all routes (generous for browsing)
app.use(readOnlyLimiter);

app.use(express.json());
app.use(cookieParser());

// Apply specific rate limiters to routes
app.use("/pins", uploadOnlyLimiter, pinsRouter);
app.use("/comments", interactionOnlyLimiter, commentsRouter);
app.use("/boards", uploadOnlyLimiter, boardsRouter);
app.use('/auth', authLimiter, authRouter);
app.use("/users", writeOperationsLimiter, usersRouter);
app.use("/notifications", writeOperationsLimiter, notificationsRouter);
app.use("/messages", messageOnlyLimiter, messagesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
