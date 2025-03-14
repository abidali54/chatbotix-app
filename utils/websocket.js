const WebSocket = require('ws');
const SystemMetrics = require('./systemMetrics');

class MonitoringWebSocket {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.setupWebSocket();
    this.startMetricsInterval();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  startMetricsInterval() {
    setInterval(async () => {
      const metrics = await SystemMetrics.getDetailedMetrics();
      this.broadcast(metrics);
    }, 5000);
  }

  broadcast(data) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = MonitoringWebSocket;