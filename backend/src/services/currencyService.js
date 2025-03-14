const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

class CurrencyService {
  constructor() {
    this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/';
    this.baseCurrency = process.env.BASE_CURRENCY || 'USD';
    this.exchangeRates = {};
    this.lastUpdated = null;
  }

  async updateExchangeRates() {
    try {
      const response = await axios.get(`${this.baseUrl}${this.baseCurrency}`);
      this.exchangeRates = response.data.rates;
      this.lastUpdated = new Date();

      // Store rates in database for history
      await prisma.exchangeRate.create({
        data: {
          baseCurrency: this.baseCurrency,
          rates: this.exchangeRates,
          timestamp: this.lastUpdated
        }
      });

      return this.exchangeRates;
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      throw error;
    }
  }

  async getExchangeRates() {
    // Update rates if they're more than 24 hours old
    if (!this.lastUpdated || new Date() - this.lastUpdated > 24 * 60 * 60 * 1000) {
      await this.updateExchangeRates();
    }
    return this.exchangeRates;
  }

  async convertPrice(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getExchangeRates();

      if (fromCurrency === toCurrency) return amount;

      // Convert to base currency first if needed
      const inBaseCurrency = fromCurrency === this.baseCurrency
        ? amount
        : amount / rates[fromCurrency];

      // Convert to target currency
      const converted = inBaseCurrency * rates[toCurrency];

      return Number(converted.toFixed(2));
    } catch (error) {
      console.error('Error converting price:', error);
      throw error;
    }
  }

  async getProductPrices(productId, currency) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) throw new Error('Product not found');

      const convertedPrice = await this.convertPrice(
        product.price,
        this.baseCurrency,
        currency
      );

      return {
        original: {
          amount: product.price,
          currency: this.baseCurrency
        },
        converted: {
          amount: convertedPrice,
          currency: currency
        }
      };
    } catch (error) {
      console.error('Error getting product prices:', error);
      throw error;
    }
  }

  async getSupportedCurrencies() {
    const rates = await this.getExchangeRates();
    return Object.keys(rates);
  }
}

module.exports = new CurrencyService();