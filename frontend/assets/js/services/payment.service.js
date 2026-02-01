// FILE: assets/js/services/payment.service.js

import { storage } from "../base/storage.js";
import { generateId } from "../base/helpers.js";
import { CONFIG } from "../base/config.js";

class PaymentService {
  async processPayment(paymentData) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const payments = storage.get("payments", []);
    const user = storage.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const newPayment = {
      id: generateId(),
      userId: user.id,
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: CONFIG.PAYMENT.STATUS.COMPLETED,
      transactionId: `TXN${generateId()}`,
      cardNumber: paymentData.cardNumber
        ? `****${paymentData.cardNumber.slice(-4)}`
        : null,
      createdAt: new Date().toISOString(),
    };

    payments.push(newPayment);
    storage.set("payments", newPayment);

    return newPayment;
  }

  async getUserPayments(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const payments = storage.get("payments", []);
    const bookings = storage.get("bookings", []);

    return payments
      .filter((p) => p.userId === userId)
      .map((payment) => {
        const booking = bookings.find((b) => b.id === payment.bookingId);
        return { ...payment, booking };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPaymentById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const payments = storage.get("payments", []);
    const payment = payments.find((p) => p.id === id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async getAllPayments() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const payments = storage.get("payments", []);
    const users = storage.get("users", []);

    return payments
      .map((payment) => {
        const user = users.find((u) => u.id === payment.userId);
        return { ...payment, user };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async refundPayment(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const payments = storage.get("payments", []);
    const paymentIndex = payments.findIndex((p) => p.id === id);

    if (paymentIndex === -1) {
      throw new Error("Payment not found");
    }

    payments[paymentIndex].status = CONFIG.PAYMENT.STATUS.REFUNDED;
    payments[paymentIndex].refundedAt = new Date().toISOString();

    storage.set("payments", payments);

    return payments[paymentIndex];
  }

  async getPaymentStats(userId, role) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let payments;

    if (role === CONFIG.AUTH.ROLES.ADMIN) {
      payments = storage.get("payments", []);
    } else {
      payments = storage.get("payments", []).filter((p) => p.userId === userId);
    }

    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const completedPayments = payments.filter(
      (p) => p.status === CONFIG.PAYMENT.STATUS.COMPLETED,
    );
    const refundedPayments = payments.filter(
      (p) => p.status === CONFIG.PAYMENT.STATUS.REFUNDED,
    );

    return {
      total: payments.length,
      totalAmount,
      completed: completedPayments.length,
      completedAmount: completedPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0,
      ),
      refunded: refundedPayments.length,
      refundedAmount: refundedPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0,
      ),
    };
  }
}

export const paymentService = new PaymentService();
