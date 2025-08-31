/**
 * Frontend environment variable validation utility
 * Validates required Vite environment variables at application startup
 */

const requiredEnvVars = [
  {
    key: 'VITE_API_BASE_URL',
    description: 'Backend API base URL',
    validator: (value) => {
      try {
        new URL(value);
        return null;
      } catch {
        return 'VITE_API_BASE_URL must be a valid URL';
      }
    }
  },
  {
    key: 'VITE_IMAGEKIT_URL_ENDPOINT',
    description: 'ImageKit URL endpoint for frontend uploads',
    validator: (value) => {
      if (!value.startsWith('https://ik.imagekit.io/')) {
        return 'VITE_IMAGEKIT_URL_ENDPOINT must be a valid ImageKit endpoint';
      }
      return null;
    }
  }
];

export function validateEnvironment() {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    console.log('🔍 Validating frontend environment variables...');
  }
  
  const errors = [];
  const warnings = [];
  
  // Check required variables
  for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar.key];
    
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
  
  // Check for development mode warnings
  if (isDevelopment) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl && !apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1')) {
      warnings.push('⚠️  Using external API in development mode');
    }
  }
  
  // Display warnings only in development
  if (warnings.length > 0 && isDevelopment) {
    console.log('\n⚠️  Environment Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  // Handle errors
  if (errors.length > 0) {
    if (isDevelopment) {
      console.error('\n🚨 Frontend Environment Validation Failed!');
      console.error('Missing or invalid environment variables:\n');
      errors.forEach(error => console.error(`  ${error}`));
      
      console.error('\n📝 Please check your .env file in the frontend directory.');
      console.error('💡 Tip: All frontend environment variables must be prefixed with VITE_');
      console.error('💡 Copy .env.example to .env and fill in the values.\n');
      
      // Create error overlay for development
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100vw; 
          height: 100vh; 
          background: rgba(0,0,0,0.9); 
          color: white; 
          padding: 20px; 
          font-family: monospace; 
          z-index: 9999;
          overflow: auto;
        ">
          <h2>🚨 Environment Configuration Error</h2>
          <p>The application cannot start due to missing environment variables:</p>
          <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
          <p>Please check your .env file and refresh the page.</p>
          <button onclick="location.reload()" style="
            background: #ff4444; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            cursor: pointer;
            margin-top: 20px;
          ">Retry</button>
        </div>
      `;
      document.body.appendChild(errorDiv);
    } else {
      // Production: minimal error output
      console.error('Frontend environment validation failed: Missing required configuration');
    }
    
    throw new Error('Environment validation failed');
  }
  
  if (isDevelopment) {
    console.log('✅ Frontend environment validation passed!');
    
    // Log environment info
    const mode = import.meta.env.MODE;
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    console.log(`🚀 Frontend running in ${mode} mode`);
    console.log(`📡 API endpoint: ${apiUrl}`);
  }
}