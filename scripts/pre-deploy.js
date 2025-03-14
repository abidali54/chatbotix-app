const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const preDeployChecks = {
  database: async () => {
    try {
      await prisma.$connect();
      await prisma.$executeRaw`SELECT 1`;
      console.log('✅ Database connection successful');
      
      // Run migrations
      await exec('npx prisma migrate deploy');
      console.log('✅ Database migrations completed');
      
      // Test backup
      await require('./backup')();
      console.log('✅ Backup system verified');
    } catch (error) {
      console.error('❌ Database checks failed:', error);
      throw error;
    }
  },

  security: async () => {
    try {
      // Check SSL certificates
      const sslPath = path.join(__dirname, '../ssl');
      if (!fs.existsSync(`${sslPath}/private.key`) || 
          !fs.existsSync(`${sslPath}/certificate.crt`)) {
        throw new Error('SSL certificates missing');
      }
      
      // Verify environment variables
      const requiredEnvVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASSWORD'
      ];
      
      const missing = requiredEnvVars.filter(v => !process.env[v]);
      if (missing.length) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
      }
      
      console.log('✅ Security checks passed');
    } catch (error) {
      console.error('❌ Security checks failed:', error);
      throw error;
    }
  },

  performance: async () => {
    try {
      // Compress static assets
      await exec('npm run build');
      
      // Clear caches
      await exec('npm run clear-cache');
      
      // Test load handling
      const loadTest = await exec('npm run load-test');
      if (loadTest.stderr) {
        throw new Error('Load test failed');
      }
      
      console.log('✅ Performance checks passed');
    } catch (error) {
      console.error('❌ Performance checks failed:', error);
      throw error;
    }
  }
};

const runAllChecks = async () => {
  try {
    await preDeployChecks.database();
    await preDeployChecks.security();
    await preDeployChecks.performance();
    console.log('✅ All pre-deployment checks passed');
    return true;
  } catch (error) {
    console.error('❌ Pre-deployment checks failed:', error);
    return false;
  }
};

module.exports = { preDeployChecks, runAllChecks };
