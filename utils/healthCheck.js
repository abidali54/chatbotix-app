const os = require('os');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class HealthCheck {
  async runChecks() {
    return {
      timestamp: new Date(),
      status: 'running',
      checks: {
        system: await this.checkSystem(),
        database: await this.checkDatabase(),
        memory: await this.checkMemory(),
        diskSpace: await this.checkDiskSpace()
      }
    };
  }

  async checkSystem() {
    return {
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      platform: os.platform(),
      cpuUsage: process.cpuUsage(),
      nodeVersion: process.version
    };
  }

  async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'connected', latency: await this.measureDbLatency() };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async checkMemory() {
    const used = process.memoryUsage();
    return {
      total: os.totalmem(),
      free: os.freemem(),
      heapUsed: used.heapUsed,
      heapTotal: used.heapTotal,
      external: used.external
    };
  }

  async checkDiskSpace() {
    // Windows-specific disk space check
    const { exec } = require('child_process');
    return new Promise((resolve) => {
      exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
        if (error) {
          resolve({ error: error.message });
          return;
        }
        resolve({ diskInfo: stdout.trim() });
      });
    });
  }

  async measureDbLatency() {
    const start = process.hrtime();
    await prisma.$queryRaw`SELECT 1`;
    const [seconds, nanoseconds] = process.hrtime(start);
    return seconds * 1000 + nanoseconds / 1000000;
  }
}

module.exports = new HealthCheck();