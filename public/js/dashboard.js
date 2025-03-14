class DashboardUI {
  constructor() {
    this.charts = {};
    this.initializeCharts();
    this.connectWebSocket();
  }

  initializeCharts() {
    this.charts.cpu = new Chart('cpuChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'CPU Usage',
          data: []
        }]
      }
    });

    this.charts.memory = new Chart('memoryChart', {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Free'],
        datasets: [{
          data: [0, 0]
        }]
      }
    });
  }

  connectWebSocket() {
    this.ws = new WebSocket(`ws://${window.location.host}`);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updateCharts(data);
    };
  }

  updateCharts(data) {
    this.updateCPUChart(data.cpu);
    this.updateMemoryChart(data.memory);
    this.updateMetricsTable(data);
  }
}