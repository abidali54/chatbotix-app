/**
 * @swagger
 * /api/admin/backups:
 *   get:
 *     summary: List all backups
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of backups
 *       401:
 *         description: Unauthorized
 * 
 * /api/admin/backups/restore/{filename}:
 *   post:
 *     summary: Restore a backup
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backup restored successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid filename
 */