class ThresholdConfiguration {
  constructor() {
    this.initializeUI();
    this.loadCurrentThresholds();
    this.setupEventListeners();
    this.history = [];
    this.initializeRealTimeVisualization();
  }

  initializeUI() {
    this.createThresholdForms();
    this.createVisualization();
  }

  createThresholdForms() {
    const container = document.getElementById('threshold-config');
    
    Object.entries(thresholds).forEach(([category, settings]) => {
      const form = this.createCategoryForm(category, settings);
      container.appendChild(form);
    });
  }

  createCategoryForm(category, settings) {
    const form = document.createElement('form');
    form.className = 'threshold-form';
    form.innerHTML = `
      <h3>${category.toUpperCase()}</h3>
      ${Object.entries(settings).map(([key, value]) => `
        <div class="form-group">
          <label for="${category}-${key}">${key}:</label>
          <input 
            type="number" 
            id="${category}-${key}"
            value="${value}"
            data-category="${category}"
            data-key="${key}"
          >
        </div>
      `).join('')}
    `;
    return form;
  }

  setupEventListeners() {
    document.querySelectorAll('.threshold-form input').forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateThreshold(
          e.target.dataset.category,
          e.target.dataset.key,
          e.target.value
        );
      });
    });
  }

  initializeRealTimeVisualization() {
    this.charts = {
      cpu: new Chart('cpuThresholdChart', {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Current Usage',
              data: []
            },
            {
              label: 'Warning Threshold',
              data: []
            },
            {
              label: 'Critical Threshold',
              data: []
            }
          ]
        }
      })
    };
  }

  validateThreshold(category, key, value) {
    const rules = {
      cpu: {
        warning: { min: 0, max: 100 },
        critical: { min: 0, max: 100 }
      },
      memory: {
        warning: { min: 0, max: 100 },
        critical: { min: 0, max: 100 }
      }
    };

    const rule = rules[category]?.[key];
    if (rule) {
      return value >= rule.min && value <= rule.max;
    }
    return true;
  }

  loadPreset(presetName) {
    const presets = {
      conservative: {
        cpu: { warning: 70, critical: 85 },
        memory: { warning: 75, critical: 90 }
      },
      aggressive: {
        cpu: { warning: 85, critical: 95 },
        memory: { warning: 90, critical: 95 }
      }
    };

    const preset = presets[presetName];
    if (preset) {
      Object.entries(preset).forEach(([category, settings]) => {
        Object.entries(settings).forEach(([key, value]) => {
          this.updateThreshold(category, key, value);
        });
      });
    }
  }

  trackHistory(category, key, oldValue, newValue) {
    this.history.push({
      timestamp: new Date(),
      category,
      key,
      oldValue,
      newValue,
      user: this.getCurrentUser()
    });

    if (this.history.length > 100) {
      this.history.shift();
    }

    this.saveHistory();
  }

  async updateThreshold(category, key, value) {
    if (!this.validateThreshold(category, key, value)) {
      this.showError(`Invalid value for ${category}.${key}`);
      return;
    }

    const oldValue = this.getCurrentValue(category, key);
    
    try {
      const response = await fetch('/api/thresholds/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          key,
          value: Number(value)
        })
      });
      
      if (response.ok) {
        this.trackHistory(category, key, oldValue, value);
        this.showSuccess(`Updated ${category}.${key}`);
        this.updateVisualization(category, key, value);
      } else {
        this.showError('Failed to update threshold');
      }
    } catch (error) {
      this.showError(error.message);
    }
  }
}