const express = require('express');
const router = express.Router();
const { listBackups, restoreBackup } = require('../utils/restore');
const { backupValidation } = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/backups', async (req, res) => {
  try {
    const backups = await listBackups();
    res.json({ backups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

router.post('/backups/restore/:filename', backupValidation, async (req, res) => {
  try {
    await restoreBackup(req.params.filename);
    res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

module.exports = router;