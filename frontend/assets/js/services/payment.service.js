/**
 * Payment Service
 * Handles all payment-related API calls
 *
 * NO DOM ACCESS - Pure API logic only
 *
 * Endpoints:
 * - POST /api/payments/initiate - Initiate payment
 * - POST /api/payments/verify - Verify payment
 * - GET /api/payments/:id - Get payment details
 * - GET /api/payments/booking/:bookingId - Get payments for booking
 * - POST /api/payments/refund - Request refund
 * - GET /api/payments/methods - Get available payment methods
 * - POST /api/payments/save-card - Save card for future use
 * - GET /api/payments/saved-cards - Get saved payment methods
 * - DELETE /api/payments/card/:id - Delete saved card
 * - GET /api/payments/history - Get payment history
 */

class PaymentService {
  constructor() {
    this.baseURL = "/api/payments";
    this.useMockAPI = false; // Set to true for development without backend
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token if available
   */
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Initiate payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment initiation response
   */
  async initiatePayment(paymentData) {
    if (this.useMockAPI) {
      return this.mockInitiatePayment(paymentData);
    }

    try {
      const response = await fetch(`${this.baseURL}/initiate`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initiation failed");
      }

      return data;
    } catch (error) {
      console.error("Initiate payment error:", error);
      throw error;
    }
  }

  /**
   * Verify payment status
   * @param {string} paymentId - Payment ID or transaction ID
   * @returns {Promise<Object>} Payment verification result
   */
  async verifyPayment(paymentId) {
    if (this.useMockAPI) {
      return this.mockVerifyPayment(paymentId);
    }

    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ paymentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      return data;
    } catch (error) {
      console.error("Verify payment error:", error);
      throw error;
    }
  }

  /**
   * Get payment details by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentById(paymentId) {
    if (this.useMockAPI) {
      return this.mockGetPaymentById(paymentId);
    }

    try {
      const response = await fetch(`${this.baseURL}/${paymentId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment");
      }

      return data;
    } catch (error) {
      console.error("Get payment error:", error);
      throw error;
    }
  }

  /**
   * Get all payments for a booking
   * @param {number} bookingId - Booking ID
   * @returns {Promise<Object>} Payments list
   */
  async getPaymentsByBooking(bookingId) {
    if (this.useMockAPI) {
      return this.mockGetPaymentsByBooking(bookingId);
    }

    try {
      const response = await fetch(`${this.baseURL}/booking/${bookingId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payments");
      }

      return data;
    } catch (error) {
      console.error("Get payments by booking error:", error);
      throw error;
    }
  }

  /**
   * Request refund
   * @param {Object} refundData - Refund request details
   * @returns {Promise<Object>} Refund status
   */
  async requestRefund(refundData) {
    if (this.useMockAPI) {
      return this.mockRequestRefund(refundData);
    }

    try {
      const response = await fetch(`${this.baseURL}/refund`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(refundData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Refund request failed");
      }

      return data;
    } catch (error) {
      console.error("Request refund error:", error);
      throw error;
    }
  }

  /**
   * Get available payment methods
   * @returns {Promise<Object>} Available payment methods
   */
  async getPaymentMethods() {
    if (this.useMockAPI) {
      return this.mockGetPaymentMethods();
    }

    try {
      const response = await fetch(`${this.baseURL}/methods`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment methods");
      }

      return data;
    } catch (error) {
      console.error("Get payment methods error:", error);
      throw error;
    }
  }

  /**
   * Save card for future payments
   * @param {Object} cardData - Card details
   * @returns {Promise<Object>} Saved card info
   */
  async saveCard(cardData) {
    if (this.useMockAPI) {
      return this.mockSaveCard(cardData);
    }

    try {
      const response = await fetch(`${this.baseURL}/save-card`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save card");
      }

      return data;
    } catch (error) {
      console.error("Save card error:", error);
      throw error;
    }
  }

  /**
   * Get user's saved cards
   * @returns {Promise<Object>} List of saved cards
   */
  async getSavedCards() {
    if (this.useMockAPI) {
      return this.mockGetSavedCards();
    }

    try {
      const response = await fetch(`${this.baseURL}/saved-cards`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch saved cards");
      }

      return data;
    } catch (error) {
      console.error("Get saved cards error:", error);
      throw error;
    }
  }

  /**
   * Delete saved card
   * @param {number} cardId - Card ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteSavedCard(cardId) {
    if (this.useMockAPI) {
      return this.mockDeleteSavedCard(cardId);
    }

    try {
      const response = await fetch(`${this.baseURL}/card/${cardId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete card");
      }

      return data;
    } catch (error) {
      console.error("Delete card error:", error);
      throw error;
    }
  }

  /**
   * Get payment history
   * @param {Object} filters - Filter parameters (page, limit, startDate, endDate)
   * @returns {Promise<Object>} Payment history
   */
  async getPaymentHistory(filters = {}) {
    if (this.useMockAPI) {
      return this.mockGetPaymentHistory(filters);
    }

    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = queryParams.toString()
        ? `${this.baseURL}/history?${queryParams}`
        : `${this.baseURL}/history`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment history");
      }

      return data;
    } catch (error) {
      console.error("Get payment history error:", error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Format amount for display
   * @param {number} amount - Amount in paise/cents
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    return `₹${(amount / 100).toFixed(2)}`;
  }

  /**
   * Validate card number (basic Luhn algorithm)
   * @param {string} cardNumber - Card number
   * @returns {boolean} Valid or not
   */
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (!/^\d+$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Get card type from number
   * @param {string} cardNumber - Card number
   * @returns {string} Card type (visa, mastercard, rupay, amex)
   */
  getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^6(?:011|5)/.test(cleaned)) return "rupay";
    if (/^3[47]/.test(cleaned)) return "amex";

    return "unknown";
  }

  // ==================== Mock API Methods ====================

  mockInitiatePayment(paymentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const paymentId = `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const transactionId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        resolve({
          success: true,
          message: "Payment initiated successfully",
          paymentId,
          transactionId,
          amount: paymentData.amount,
          currency: "INR",
          status: "pending",
          redirectUrl: null, // For gateway redirect if needed
          paymentMethod: paymentData.method,
        });
      }, 1000);
    });
  }

  mockVerifyPayment(paymentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Payment verified successfully",
          paymentId,
          status: "success",
          amount: 10500,
          transactionId: `TXN_${Math.random().toString(36).substr(2, 9)}`,
          paidAt: new Date().toISOString(),
        });
      }, 1500);
    });
  }

  mockGetPaymentById(paymentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment: {
            id: paymentId,
            transactionId: `TXN_${paymentId}`,
            bookingId: 1,
            amount: 10500,
            currency: "INR",
            method: "card",
            status: "success",
            paidAt: new Date().toISOString(),
            cardLast4: "4242",
            cardType: "visa",
          },
        });
      }, 600);
    });
  }

  mockGetPaymentsByBooking(bookingId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payments: [
            {
              id: 1,
              transactionId: "TXN_12345",
              amount: 10500,
              method: "card",
              status: "success",
              paidAt: new Date().toISOString(),
            },
          ],
          total: 10500,
        });
      }, 600);
    });
  }

  mockRequestRefund(refundData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Refund request submitted successfully",
          refundId: `REF_${Math.random().toString(36).substr(2, 9)}`,
          amount: refundData.amount,
          status: "processing",
          estimatedDays: "5-7 business days",
        });
      }, 1000);
    });
  }

  mockGetPaymentMethods() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          methods: [
            {
              id: "card",
              name: "Credit/Debit Card",
              enabled: true,
              types: ["visa", "mastercard", "rupay"],
            },
            {
              id: "upi",
              name: "UPI",
              enabled: true,
              providers: ["gpay", "phonepe", "paytm"],
            },
            {
              id: "netbanking",
              name: "Net Banking",
              enabled: true,
            },
            {
              id: "wallet",
              name: "Wallets",
              enabled: true,
              providers: ["paytm", "phonepe", "amazonpay"],
            },
          ],
        });
      }, 500);
    });
  }

  mockSaveCard(cardData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Card saved successfully",
          card: {
            id: Math.floor(Math.random() * 1000),
            last4: cardData.cardNumber.slice(-4),
            type: this.getCardType(cardData.cardNumber),
            expiryMonth: cardData.expiryMonth,
            expiryYear: cardData.expiryYear,
            isDefault: true,
          },
        });
      }, 800);
    });
  }

  mockGetSavedCards() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          cards: [
            {
              id: 1,
              last4: "4242",
              type: "visa",
              expiryMonth: "12",
              expiryYear: "2028",
              isDefault: true,
            },
            {
              id: 2,
              last4: "5555",
              type: "mastercard",
              expiryMonth: "06",
              expiryYear: "2027",
              isDefault: false,
            },
          ],
        });
      }, 600);
    });
  }

  mockDeleteSavedCard(cardId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Card deleted successfully",
          cardId,
        });
      }, 600);
    });
  }

  mockGetPaymentHistory(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPayments = Array.from(
          { length: filters.limit || 10 },
          (_, i) => ({
            id: i + 1,
            transactionId: `TXN_${i + 1}`,
            bookingRef: `AP-2026-${String(i + 1).padStart(5, "0")}`,
            amount: 10500 + i * 500,
            method: ["card", "upi", "netbanking"][i % 3],
            status: "success",
            paidAt: new Date(
              Date.now() - i * 24 * 60 * 60 * 1000,
            ).toISOString(),
          }),
        );

        resolve({
          success: true,
          payments: mockPayments,
          page: filters.page || 1,
          totalPages: 5,
          total: 50,
        });
      }, 800);
    });
  }
}

// Create singleton instance
const paymentService = new PaymentService();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = paymentService;
}

// Global access
if (typeof window !== "undefined") {
  window.paymentService = paymentService;
}
