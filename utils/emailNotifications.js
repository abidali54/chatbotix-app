const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const schedule = require('node-schedule');
const shortid = require('shortid');
const { v4: uuidv4 } = require('uuid');

class EmailNotificationSystem {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendSubscriptionExpiry(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    await this.transporter.sendMail({
      to: user.email,
      subject: 'Subscription Expiring Soon',
      html: this.getExpiryTemplate(user)
    });
  }

  async sendPaymentConfirmation(userId, payment) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    await this.transporter.sendMail({
      to: user.email,
      subject: 'Payment Confirmation',
      html: this.getPaymentTemplate(payment)
    });
  }

  async sendSubscriptionRenewal(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    await this.transporter.sendMail({
      to: user.email,
      subject: 'Subscription Renewed',
      html: this.getRenewalTemplate(user)
    });
  }

  getExpiryTemplate(user) {
    return `
      <h2>Your Subscription is Expiring Soon</h2>
      <p>Dear ${user.name},</p>
      <p>Your subscription will expire on ${new Date(user.subscription.endDate).toLocaleDateString()}.</p>
      <p>Renew now to maintain uninterrupted access to our services.</p>
      <a href="${process.env.APP_URL}/renew" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Now</a>
    `;
  }

  getPaymentTemplate(payment) {
    return `
      <h2>Payment Confirmation</h2>
      <p>Thank you for your payment!</p>
      <p>Amount: $${payment.amount}</p>
      <p>Transaction ID: ${payment.id}</p>
      <p>Date: ${new Date(payment.createdAt).toLocaleString()}</p>
    `;
  }

  getRenewalTemplate(user) {
    return `
      <h2>Subscription Renewed Successfully</h2>
      <p>Dear ${user.name},</p>
      <p>Your subscription has been renewed until ${new Date(user.subscription.endDate).toLocaleDateString()}.</p>
      <p>Thank you for continuing with our service!</p>
    `;
  }
  
  async trackEmail(emailId, userId, template, variant = 'A') {
    const trackingId = uuidv4();
    const clickId = shortid.generate();
    
    await prisma.emailTracking.create({
      data: {
        id: trackingId,
        emailId,
        userId,
        template,
        variant,
        status: 'sent',
        sentAt: new Date(),
        clicks: 0,
        opens: 0
      }
    });

    const trackingPixel = `<img src="${process.env.APP_URL}/api/email-tracking/${trackingId}/open" style="display:none" />`;
    const trackedLinks = this.addClickTracking(emailId, trackingId, clickId);

    return { trackingPixel, trackedLinks };
  }

  addClickTracking(emailId, trackingId, clickId) {
    return (html) => {
      return html.replace(
        /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/g,
        `<a href="${process.env.APP_URL}/api/email-tracking/${trackingId}/click/${clickId}?url=$1"$2>`
      );
    };
  }

  async getEmailMetrics(templateId) {
    return await prisma.emailTracking.groupBy({
      by: ['template', 'variant'],
      _count: {
        id: true
      },
      _avg: {
        opens: true,
        clicks: true
      },
      where: {
        template: templateId
      }
    });
  }
  async getPersonalizationData(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        profile: true,
        activityHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  
    return {
      user: {
        name: user.name,
        email: user.email,
        joinDate: user.createdAt,
        lastLogin: user.activityHistory[0]?.createdAt,
        preferences: user.profile.preferences
      },
      subscription: {
        plan: user.subscription?.plan.name,
        endDate: user.subscription?.endDate,
        status: user.subscription?.status
      }
    };
  }
  async getTemplatePerformance(templateId, timeRange = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
  
    return await prisma.emailTracking.groupBy({
      by: ['template', 'variant'],
      _count: {
        id: true,
        opens: true,
        clicks: true
      },
      _avg: {
        opens: true,
        clicks: true,
        deliveryTime: true
      },
      where: {
        template: templateId,
        sentAt: {
          gte: startDate
        }
      }
    });
  }
  async organizeTemplate(templateId, data) {
    await prisma.emailTemplate.update({
      where: { id: templateId },
      data: {
        category: data.category,
        tags: data.tags,
        lastModified: new Date(),
        version: { increment: 1 }
      }
    });
  }
  processTemplate(template, personalizedData) {
    let processed = template;
    
    // Process conditional content
    processed = this.processConditionalContent(processed, personalizedData);
    
    // Process dynamic segments
    processed = this.processDynamicSegments(processed, personalizedData);
    
    // Process regular tags
    const tags = {
      ...personalizedData.user,
      ...personalizedData.subscription,
      currentDate: new Date().toLocaleDateString(),
      companyName: process.env.COMPANY_NAME,
      supportEmail: process.env.SUPPORT_EMAIL
    };

    Object.entries(tags).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value || '');
    });

    return processed;
  }

  processConditionalContent(template, data) {
    const conditionalRegex = /{{if\s+([^}]+)}}([\s\S]*?){{else}}([\s\S]*?){{endif}}/g;
    return template.replace(conditionalRegex, (match, condition, ifContent, elseContent) => {
      const result = this.evaluateCondition(condition, data);
      return result ? ifContent : elseContent;
    });
  }

  processDynamicSegments(template, data) {
    const segmentRegex = /{{segment\s+([^}]+)}}([\s\S]*?){{endsegment}}/g;
    return template.replace(segmentRegex, (match, segmentName, content) => {
      return this.getDynamicSegment(segmentName, data, content);
    });
  }

  async analyzeABTestResults(testId) {
    const results = await prisma.abTest.findUnique({
      where: { id: testId },
      include: {
        variants: {
          include: {
            metrics: true
          }
        }
      }
    });

    const analysis = {
      winner: null,
      confidence: 0,
      metrics: {},
      recommendations: []
    };

    // Calculate statistical significance
    const variants = results.variants.map(variant => ({
      id: variant.id,
      opens: variant.metrics.opens,
      clicks: variant.metrics.clicks,
      conversions: variant.metrics.conversions,
      totalSent: variant.metrics.totalSent
    }));

    analysis.metrics = this.calculateMetrics(variants);
    analysis.winner = this.determineWinner(variants);
    analysis.confidence = this.calculateConfidence(variants);
    analysis.recommendations = this.generateRecommendations(analysis);

    await this.saveTestAnalysis(testId, analysis);
    return analysis;
  }

  async backupTemplate(templateId) {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
      include: {
        variants: true,
        metrics: true
      }
    });

    const backup = {
      id: uuidv4(),
      templateId,
      data: template,
      createdAt: new Date()
    };

    await prisma.templateBackup.create({
      data: backup
    });

    return backup.id;
  }

  async restoreTemplate(backupId) {
    const backup = await prisma.templateBackup.findUnique({
      where: { id: backupId }
    });

    if (!backup) {
      throw new Error('Backup not found');
    }

    const { templateId, data } = backup;
    await prisma.emailTemplate.update({
      where: { id: templateId },
      data: {
        content: data.content,
        subject: data.subject,
        variants: {
          deleteMany: {},
          create: data.variants
        },
        metrics: {
          upsert: {
            create: data.metrics,
            update: data.metrics
          }
        }
      }
    });

    return templateId;
  }
}

module.exports = new EmailNotificationSystem();
