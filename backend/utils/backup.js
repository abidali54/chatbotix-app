const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDir = path.join(__dirname, '../backups');

const createBackup = async () => {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  const filepath = path.join(backupDir, filename);

  const command = `pg_dump -U postgres -d chatbotix > "${filepath}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Backup Error:', error);
        reject(error);
        return;
      }
      resolve(filepath);
    });
  });
};

const scheduleBackup = () => {
  // Run backup every day at midnight
  const backupSchedule = '0 0 * * *';
  
  require('node-cron').schedule(backupSchedule, async () => {
    try {
      const backupPath = await createBackup();
      console.log(`Backup created successfully at: ${backupPath}`);
      
      // Keep only last 7 backups
      const files = fs.readdirSync(backupDir);
      if (files.length > 7) {
        const oldestFile = files.sort()[0];
        fs.unlinkSync(path.join(backupDir, oldestFile));
      }
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  });
};

module.exports = { createBackup, scheduleBackup };