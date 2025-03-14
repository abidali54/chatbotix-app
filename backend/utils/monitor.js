const { performance } = require('perf_hooks');
const os = require('os');
const logger = require('./logger');

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  startTimer(label) {
    this.metrics.set(label, performance.now());
  }

  endTimer(label) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.info(`Performance: ${label} took ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
  }

  trackMemory() {
    const used = process.memoryUsage();
    logger.info('Memory Usage:', {
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`
    });
  }

  getSystemMetrics() {
    return {
      uptime: process.uptime(),
      systemUptime: os.uptime(),
      loadAverage: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuUsage: process.cpuUsage(),
      networkInterfaces: os.networkInterfaces(),
      processMemory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      threadCount: process.env.UV_THREADPOOL_SIZE || 4
    };
  }

  async getDatabaseMetrics(prisma) {
    try {
      const startTime = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbLatency = performance.now() - startTime;
      
      return {
        connected: true,
        latency: dbLatency
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

const monitor = new PerformanceMonitor();
module.exports = monitor;
