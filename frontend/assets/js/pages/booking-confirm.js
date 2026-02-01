// FILE: assets/js/pages/booking-confirm.js

import { paymentService } from "../services/payment.service.js";
import { bookingService } from "../services/booking.service.js";
import { formatCurrency } from "../base/helpers.js";
import { storage } from "../base/storage.js";
import { requireAuth } from "../core/auth-guard.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showNotification } from "../ui/notifications.js";
import { CONFIG } from "../base/config.js";

export const initBookingConfirm = () => {
  if (!requireAuth()) return;

  const paymentData = storage.get("pending_payment");

  if (!paymentData) {
    showNotification("No payment data found", "error");
    window.location.href = "/user/my-bookings";
    return;
  }

  displayPaymentSummary(paymentData);
  setupPaymentForm(paymentData);
};

const displayPaymentSummary = (paymentData) => {
  const summaryEl = document.querySelector("#payment-summary");
  if (!summaryEl) return;

  summaryEl.innerHTML = `
    <div class="summary-row">
      <span>Booking ID:</span>
      <strong>${paymentData.bookingId}</strong>
    </div>
    <div class="summary-row">
      <span>Amount:</span>
      <strong>${formatCurrency(paymentData.amount)}</strong>
    </div>
  `;
};

const setupPaymentForm = (paymentData) => {
  const form = document.querySelector("#payment-form");
  if (!form) return;

  const methodInputs = form.querySelectorAll('input[name="paymentMethod"]');
  const cardDetails = document.querySelector("#card-details");

  methodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "Credit Card" || input.value === "Debit Card") {
        cardDetails?.classList.remove("d-none");
      } else {
        cardDetails?.classList.add("d-none");
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const method = formData.get("paymentMethod");

    if (!method) {
      showNotification("Please select a payment method", "error");
      return;
    }

    showLoader();

    try {
      const payment = await paymentService.processPayment({
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        method,
        cardNumber: formData.get("cardNumber"),
        cardName: formData.get("cardName"),
        cvv: formData.get("cvv"),
        expiryDate: formData.get("expiryDate"),
      });

      await bookingService.updateBookingStatus(
        paymentData.bookingId,
        CONFIG.BOOKING.STATUS.CONFIRMED,
      );

      storage.remove("pending_payment");

      showNotification("Payment successful! Booking confirmed.", "success");

      setTimeout(() => {
        window.location.href = "/user/my-bookings";
      }, 2000);
    } catch (error) {
      showNotification("Payment failed. Please try again.", "error");
    } finally {
      hideLoader();
    }
  });
};
