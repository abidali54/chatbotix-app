const { exec } = require('child_process');
const monitor = require('./monitor');
const thresholds = require('../config/alertThresholds');

class AutoScaling {
  constructor() {
    this.currentInstances = 1;
    this.maxInstances = 5;
    this.cooldownPeriod = 300000; // 5 minutes
    this.lastScaleTime = Date.now();
  }

  async checkScaling() {
    const metrics = await monitor.getDetailedMetrics();
    
    if (this.canScale()) {
      if (this.needsScaleUp(metrics)) {
        await this.scaleUp();
      } else if (this.needsScaleDown(metrics)) {
        await this.scaleDown();
      }
    }
  }

  needsScaleUp(metrics) {
    return metrics.cpu.usage > thresholds.cpu.warning ||
           metrics.memory.usagePercentage > thresholds.memory.warning;
  }

  needsScaleDown(metrics) {
    return metrics.cpu.usage < thresholds.cpu.warning / 2 &&
           metrics.memory.usagePercentage < thresholds.memory.warning / 2;
  }

  async scaleUp() {
    if (this.currentInstances < this.maxInstances) {
      await this.executeScaling('up');
      this.currentInstances++;
      this.lastScaleTime = Date.now();
    }
  }

  async scaleDown() {
    if (this.currentInstances > 1) {
      await this.executeScaling('down');
      this.currentInstances--;
      this.lastScaleTime = Date.now();
    }
  }

  canScale() {
    return Date.now() - this.lastScaleTime > this.cooldownPeriod;
  }

  async executeScaling(direction) {
    const command = direction === 'up' 
      ? `pm2 scale chatbotix +1`
      : `pm2 scale chatbotix -1`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
  }
}