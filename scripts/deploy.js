const { exec } = require('child_process');
const { runAllChecks } = require('./pre-deploy');

const deploy = async () => {
  try {
    // Run pre-deployment checks
    const checksPass = await runAllChecks();
    if (!checksPass) {
      throw new Error('Pre-deployment checks failed');
    }

    // Build the application
    console.log('Building application...');
    await exec('npm run build');

    // Deploy to production
    console.log('Deploying to production...');
    await exec('npm run deploy:prod');

    console.log('✅ Deployment successful');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
};

deploy();