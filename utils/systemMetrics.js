const os = require('os');
const diskusage = require('diskusage');
const pidusage = require('pidusage');

class SystemMetrics {
  async getDetailedMetrics() {
    return {
      cpu: await this.getCpuMetrics(),
      memory: await this.getMemoryMetrics(),
      network: this.getNetworkMetrics(),
      process: await this.getProcessMetrics(),
      disk: await this.getDiskMetrics()
    };
  }

  async getCpuMetrics() {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    return {
      cores: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed,
      loadAverage: {
        '1min': loadAvg[0],
        '5min': loadAvg[1],
        '15min': loadAvg[2]
      },
      usage: await pidusage(process.pid)
    };
  }

  async getMemoryMetrics() {
    const total = os.totalmem();
    const free = os.freemem();
    return {
      total,
      free,
      used: total - free,
      usagePercentage: ((total - free) / total * 100).toFixed(2),
      processMemory: process.memoryUsage()
    };
  }

  getNetworkMetrics() {
    const interfaces = os.networkInterfaces();
    return Object.entries(interfaces).reduce((acc, [name, data]) => {
      acc[name] = data.map(({ address, netmask, family, internal }) => ({
        address, netmask, family, internal
      }));
      return acc;
    }, {});
  }

  async getDiskMetrics() {
    const path = 'C:';
    const info = await diskusage.check(path);
    return {
      total: info.total,
      free: info.free,
      used: info.total - info.free,
      usagePercentage: ((info.total - info.free) / info.total * 100).toFixed(2)
    };
  }

  async getProcessMetrics() {
    return {
      uptime: process.uptime(),
      pid: process.pid,
      title: process.title,
      nodeVersion: process.version,
      resourceUsage: process.resourceUsage()
    };
  }
}

module.exports = new SystemMetrics();