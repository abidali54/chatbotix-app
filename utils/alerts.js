const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AlertSystem {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async checkSystem() {
    try {
      const metrics = {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        dbConnection: await this.checkDatabase()
      };

      if (metrics.memory.heapUsed / metrics.memory.heapTotal > 0.9) {
        await this.sendAlert('High Memory Usage', metrics);
      }

      if (!metrics.dbConnection) {
        await this.sendAlert('Database Connection Failed', metrics);
      }
    } catch (error) {
      console.error('Alert check failed:', error);
    }
  }

  async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async sendAlert(title, data) {
    await this.transporter.sendMail({
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_TO,
      subject: `Alert: ${title}`,
      text: JSON.stringify(data, null, 2)
    });
  }
}

module.exports = new AlertSystem();