const fs = require('fs');
const path = require('path');

// Environment variables template
const envTemplate = `# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-change-this
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-api-key
CLOUD_API_SECRET=your-api-secret

# OAuth Providers (optional)
FACEBOOK_ID=your-facebook-id
FACEBOOK_SECRET=your-facebook-secret
GOOGLE_ID=your-google-id
GOOGLE_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
`;

const envPath = path.join(__dirname, '.env.local');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env.local file');
    console.log('📝 Please edit .env.local with your actual values');
  } else {
    console.log('⚠️  .env.local already exists');
  }
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  console.log('📝 Please create .env.local manually with the following content:');
  console.log(envTemplate);
}
