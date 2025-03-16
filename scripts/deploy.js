const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const deployToVercel = () => {
  try {
    // Check environment
    const env = process.env.NODE_ENV || 'development';
    console.log(`Deploying to ${env} environment...`);

    // Build the project
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully');

    // Deploy to Vercel
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('Deployment to Vercel completed');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

deployToVercel();