const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const restoreBackup = async (backupFile) => {
  const backupPath = path.join(__dirname, '../backups', backupFile);
  
  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found');
  }

  const command = `psql -U postgres -d chatbotix < "${backupPath}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error('Database restore failed:', error);
        reject(error);
        return;
      }
      logger.info('Database restored successfully');
      resolve(true);
    });
  });
};

const listBackups = () => {
  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    return [];
  }
  return fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .sort((a, b) => {
      return fs.statSync(path.join(backupDir, b)).mtime.getTime() -
             fs.statSync(path.join(backupDir, a)).mtime.getTime();
    });
};

module.exports = { restoreBackup, listBackups };