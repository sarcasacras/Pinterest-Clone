/**
 * Environment variable validation utility
 * Validates required environment variables at application startup
 */

const requiredEnvVars = [
  {
    key: 'MONGO',
    description: 'MongoDB connection string',
    validator: (value) => {
      if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
        return 'MONGO must be a valid MongoDB connection string';
      }
      return null;
    }
  },
  {
    key: 'JWT_SECRET',
    description: 'JWT signing secret',
    validator: (value) => {
      if (value.length < 32) {
        return 'JWT_SECRET must be at least 32 characters long';
      }
      return null;
    }
  },
  {
    key: 'IMAGEKIT_PUBLIC_KEY',
    description: 'ImageKit public key',
    validator: (value) => {
      if (!value.startsWith('public_')) {
        return 'IMAGEKIT_PUBLIC_KEY must start with "public_"';
      }
      return null;
    }
  },
  {
    key: 'IMAGEKIT_PRIVATE_KEY',
    description: 'ImageKit private key',
    validator: (value) => {
      if (!value.startsWith('private_')) {
        return 'IMAGEKIT_PRIVATE_KEY must start with "private_"';
      }
      return null;
    }
  },
  {
    key: 'IMAGEKIT_URL_ENDPOINT',
    description: 'ImageKit URL endpoint',
    validator: (value) => {
      if (!value.startsWith('https://ik.imagekit.io/')) {
        return 'IMAGEKIT_URL_ENDPOINT must be a valid ImageKit endpoint';
      }
      return null;
    }
  }
];

const optionalEnvVars = [
  {
    key: 'PORT',
    description: 'Server port (defaults to 3000)',
    validator: (value) => {
      if (value && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 65535)) {
        return 'PORT must be a valid port number (1-65535)';
      }
      return null;
    }
  },
  {
    key: 'NODE_ENV',
    description: 'Node environment (development, production, test)',
    validator: (value) => {
      if (value && !['development', 'production', 'test'].includes(value)) {
        return 'NODE_ENV must be "development", "production", or "test"';
      }
      return null;
    }
  },
  {
    key: 'FRONTEND_URL',
    description: 'Frontend URL for CORS configuration (defaults to http://localhost:5173)',
    validator: (value) => {
      if (value) {
        try {
          new URL(value);
          return null;
        } catch {
          return 'FRONTEND_URL must be a valid URL';
        }
      }
      return null;
    }
  }
];

export function validateEnvironment() {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    console.log('🔍 Validating environment variables...');
  }
  
  const errors = [];
  const warnings = [];
  
  // Check required variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.key];
    
    if (!value) {
      errors.push(`❌ ${envVar.key}: ${envVar.description} (REQUIRED)`);
      continue;
    }
    
    if (envVar.validator) {
      const validationError = envVar.validator(value);
      if (validationError) {
        errors.push(`❌ ${envVar.key}: ${validationError}`);
      }
    }
  }
  
  // Check optional variables if they exist
  for (const envVar of optionalEnvVars) {
    const value = process.env[envVar.key];
    
    if (value && envVar.validator) {
      const validationError = envVar.validator(value);
      if (validationError) {
        errors.push(`❌ ${envVar.key}: ${validationError}`);
      }
    } else if (!value && isDevelopment) {
      warnings.push(`⚠️  ${envVar.key}: ${envVar.description} (using default)`);
    }
  }
  
  // Display warnings only in development
  if (warnings.length > 0 && isDevelopment) {
    console.log('\n⚠️  Environment Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  // Handle errors (always shown)
  if (errors.length > 0) {
    if (isDevelopment) {
      console.error('\n🚨 Environment Validation Failed!');
      console.error('Missing or invalid environment variables:\n');
      errors.forEach(error => console.error(`  ${error}`));
      console.error('\n📝 Please check your .env file and ensure all required variables are set.');
      console.error('💡 Tip: Copy .env.example to .env and fill in the values.\n');
    } else {
      // Production: minimal error output
      console.error('Environment validation failed: Missing required configuration');
      console.error('Required variables:', errors.map(e => e.split(':')[0].replace('❌ ', '')).join(', '));
    }
    
    process.exit(1);
  }
  
  if (isDevelopment) {
    console.log('✅ Environment validation passed!');
    
    // Log environment info (without sensitive data)
    const nodeEnv = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || '3000';
    console.log(`🚀 Starting in ${nodeEnv} mode on port ${port}\n`);
  }
}