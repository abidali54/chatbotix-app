const nodemailer = require('nodemailer');
const twilioClient = require('twilio');
const logger = require('./logger');

class NotificationSystem {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.twilioClient = twilioClient(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendEmail(subject, message) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.ALERT_FROM,
        to: process.env.ALERT_TO,
        subject,
        text: message
      });
      logger.info('Email notification sent:', subject);
    } catch (error) {
      logger.error('Email notification failed:', error);
    }
  }

  async sendSMS(message) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        to: process.env.ALERT_PHONE,
        from: process.env.TWILIO_PHONE
      });
      logger.info('SMS notification sent');
    } catch (error) {
      logger.error('SMS notification failed:', error);
    }
  }

  async notifyAll(level, message) {
    if (level === 'critical') {
      await Promise.all([
        this.sendEmail('CRITICAL ALERT', message),
        this.sendSMS(message)
      ]);
    } else {
      await this.sendEmail('System Alert', message);
    }
  }
}

module.exports = new NotificationSystem();