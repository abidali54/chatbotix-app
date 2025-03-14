const axios = require('axios');

class PayoneerService {
  constructor() {
    this.baseURL = process.env.PAYONEER_API_URL;
    this.programId = process.env.PAYONEER_PROGRAM_ID;
    this.username = process.env.PAYONEER_USERNAME;
    this.apiPassword = process.env.PAYONEER_API_PASSWORD;
  }

  async createPayment({
    payeeId,
    amount,
    description,
    clientReferenceId
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payees/${payeeId}/payments`,
        {
          amount: {
            value: amount,
            currency: 'USD'
          },
          description,
          clientReferenceId
        },
        {
          auth: {
            username: this.username,
            password: this.apiPassword
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Payoneer payment:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/payments/${paymentId}`,
        {
          auth: {
            username: this.username,
            password: this.apiPassword
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  async createPayee({
    email,
    name,
    address,
    country,
    paymentMethod
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/programs/${this.programId}/payees`,
        {
          email,
          name,
          address,
          country,
          paymentMethod
        },
        {
          auth: {
            username: this.username,
            password: this.apiPassword
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating payee:', error);
      throw error;
    }
  }

  async getPayeeDetails(payeeId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/programs/${this.programId}/payees/${payeeId}`,
        {
          auth: {
            username: this.username,
            password: this.apiPassword
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting payee details:', error);
      throw error;
    }
  }
}

module.exports = new PayoneerService();