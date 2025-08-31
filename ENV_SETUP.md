# Environment Variables Setup

This document explains how to set up environment variables for the Pinterest Clone project.

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your actual values
   ```

## Required Services

### MongoDB Database
- **Development**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier
- **Local**: Install MongoDB locally or use Docker
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database`

### ImageKit (Image Storage)
- **Sign up**: https://imagekit.io/
- **Get credentials**: Dashboard → Developer options → API keys
- **Copy**: Public key, Private key, and URL endpoint

### JWT Secret
- **Generate secure key**: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- **Minimum length**: 32 characters
- **Production**: Use a different, secure key

## Environment Files

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGO=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
IMAGEKIT_PUBLIC_KEY=public_key_from_imagekit
IMAGEKIT_PRIVATE_KEY=private_key_from_imagekit
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
```

## Validation

The application includes environment variable validation:

- **Backend**: Validates all required variables at startup
- **Frontend**: Shows user-friendly error if variables are missing
- **Development**: Detailed error messages with setup instructions
- **Production**: Fails fast to prevent partial deployments

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit .env files** - They contain sensitive credentials
2. **Use different values for production** - Don't use development credentials in production
3. **Rotate secrets regularly** - Especially JWT secrets and API keys
4. **Frontend variables are public** - Never put secrets in VITE_ variables
5. **Use environment-specific databases** - Separate dev/staging/production data

## Troubleshooting

### "Environment validation failed"
- Check that all required variables are set in your .env file
- Ensure variable names match exactly (case-sensitive)
- Verify MongoDB connection string format
- Confirm ImageKit credentials are correct

### "VITE_API_BASE_URL must be a valid URL"
- Check for typos in the URL
- Include the protocol (http:// or https://)
- Remove trailing slashes

### Frontend shows environment error overlay
- Copy .env.example to .env in the frontend directory
- All frontend variables must start with `VITE_`
- Refresh the browser after fixing variables

## Production Deployment

For production deployment, consider:

1. **Use environment-specific values**
2. **Set NODE_ENV=production**
3. **Use HTTPS URLs for all endpoints**
4. **Configure proper CORS origins**
5. **Use production MongoDB cluster**
6. **Enable MongoDB authentication**
7. **Use secure JWT secrets (64+ characters)**

## Example Production Values

```env
# Backend production example
NODE_ENV=production
PORT=3000
MONGO=mongodb+srv://prod-user:secure-password@prod-cluster.mongodb.net/pinterest-prod
JWT_SECRET=very-long-secure-production-jwt-secret-64-characters-minimum
IMAGEKIT_PUBLIC_KEY=public_production_key
IMAGEKIT_PRIVATE_KEY=private_production_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/production-id/
```

```env
# Frontend production example
VITE_API_BASE_URL=https://api.yourpinterestclone.com
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/production-id/
```