// Environment configuration
// Copy this to .env.local file

module.exports = {
  // MongoDB
  MONGODB_URI: "mongodb://localhost:27017/ecobacgiang",
  
  // NextAuth
  NEXTAUTH_SECRET: "your-secret-key-here",
  NEXTAUTH_URL: "http://localhost:3000",
  
  // Cloudinary
  CLOUD_NAME: "your-cloud-name",
  CLOUD_API_KEY: "your-api-key", 
  CLOUD_API_SECRET: "your-api-secret",
  
  // OAuth Providers
  FACEBOOK_ID: "your-facebook-id",
  FACEBOOK_SECRET: "your-facebook-secret",
  GOOGLE_ID: "your-google-id",
  GOOGLE_SECRET: "your-google-secret",
  GITHUB_CLIENT_ID: "your-github-id",
  GITHUB_CLIENT_SECRET: "your-github-secret",
  
  // AI Configuration
  OPENAI_API_KEY: "your-openai-api-key-here",
  PYTHON_AI_SERVICE_URL: "http://localhost:5000"
};
