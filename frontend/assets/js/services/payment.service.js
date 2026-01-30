// ============================================================================
// FILE: assets/js/services/payment.service.js
// ============================================================================

/**
 * Payment Service
 * Handles payment operations
 */

import API from "../core/api.js";

const PaymentService = {
  /**
   * Create payment intent
   */
  async createPaymentIntent(bookingId) {
    return await API.post("/payments/create-intent", { bookingId });
  },

  /**
   * Process payment
   */
  async processPayment(paymentData) {
    return await API.post("/payments/process", paymentData);
  },

  /**
   * Verify payment
   */
  async verifyPayment(paymentId) {
    return await API.get(`/payments/${paymentId}/verify`);
  },

  /**
   * Get payment history
   */
  async getPaymentHistory() {
    return await API.get("/payments/history");
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    return await API.get(`/payments/${paymentId}`);
  },

  /**
   * Request refund
   */
  async requestRefund(paymentId, reason) {
    return await API.post(`/payments/${paymentId}/refund`, { reason });
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods() {
    return await API.get("/payments/methods");
  },

  /**
   * Add payment method
   */
  async addPaymentMethod(methodData) {
    return await API.post("/payments/methods", methodData);
  },

  /**
   * Remove payment method
   */
  async removePaymentMethod(methodId) {
    return await API.delete(`/payments/methods/${methodId}`);
  },
};

export default PaymentService;
