const { exec } = require('child_process');
const path = require('path');
const deployConfig = require('../config/deploy.config');

const backupDatabase = () => {
  const date = new Date().toISOString().split('T')[0];
  const backupPath = path.join(__dirname, '../backups', `backup-${date}.sql`);
  
  const command = `mysqldump -h ${deployConfig.database.host} -u ${deployConfig.database.user} -p${deployConfig.database.password} ${deployConfig.database.name} > ${backupPath}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup error: ${error}`);
      return;
    }
    console.log(`Database backup created at ${backupPath}`);
  });
};

module.exports = backupDatabase;