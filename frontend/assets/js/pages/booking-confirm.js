// ============================================================================
// FILE: assets/js/pages/booking-confirm.js
// ============================================================================

/**
 * Booking Confirmation Page
 * Display booking details and handle payment
 */

import Helpers from "../base/helpers.js";
import BookingService from "../services/booking.service.js";
import PaymentService from "../services/payment.service.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";
import AuthGuard from "../core/auth-guard.js";

const BookingConfirmPage = {
  bookingId: null,
  bookingData: null,

  init() {
    if (!AuthGuard.requireAuth()) return;

    this.bookingId = Helpers.getUrlParam("bookingId");

    if (!this.bookingId) {
      Notifications.error("Invalid booking");
      setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
      return;
    }

    this.loadBookingDetails();
    this.setupPaymentForm();
  },

  async loadBookingDetails() {
    Loader.show("Loading booking details...");

    try {
      const response = await BookingService.getBookingById(this.bookingId);

      Loader.hide();

      if (response.success && response.data) {
        this.bookingData = response.data;
        this.renderBookingDetails();
      } else {
        Notifications.error("Failed to load booking details");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error loading booking");
      console.error("Error:", error);
    }
  },

  renderBookingDetails() {
    const booking = this.bookingData;

    // Booking ID
    const bookingIdElement = document.getElementById("bookingId");
    if (bookingIdElement) bookingIdElement.textContent = `#${booking.id}`;

    // Car details
    const carDetailsElement = document.getElementById("carDetails");
    if (carDetailsElement && booking.car) {
      carDetailsElement.innerHTML = `
        <div class="confirm-car-card">
          <img src="${booking.car.image}" alt="${booking.car.name}">
          <div>
            <h4>${booking.car.name}</h4>
            <p>${booking.car.type} • ${booking.car.transmission}</p>
          </div>
        </div>
      `;
    }

    // Booking dates
    const datesElement = document.getElementById("bookingDates");
    if (datesElement) {
      datesElement.innerHTML = `
        <p><strong>Pickup:</strong> ${Helpers.formatDate(booking.pickupDate)} ${booking.pickupTime}</p>
        <p><strong>Drop-off:</strong> ${Helpers.formatDate(booking.dropDate)} ${booking.dropTime}</p>
      `;
    }

    // Price breakdown
    const priceElement = document.getElementById("priceBreakdown");
    if (priceElement) {
      priceElement.innerHTML = `
        <div class="price-row">
          <span>Base Price</span>
          <span>${Helpers.formatCurrency(booking.basePrice)}</span>
        </div>
        ${
          booking.addOns && booking.addOns.length > 0
            ? `
          <div class="price-row">
            <span>Add-ons</span>
            <span>${Helpers.formatCurrency(booking.addOnsPrice)}</span>
          </div>
        `
            : ""
        }
        <div class="price-row total">
          <strong>Total Amount</strong>
          <strong>${Helpers.formatCurrency(booking.totalPrice)}</strong>
        </div>
      `;
    }
  },

  setupPaymentForm() {
    const paymentForm = document.getElementById("paymentForm");

    if (!paymentForm) return;

    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.processPayment();
    });
  },

  async processPayment() {
    Loader.show("Processing payment...");

    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    )?.value;

    if (!paymentMethod) {
      Loader.hide();
      Notifications.warning("Please select a payment method");
      return;
    }

    try {
      const paymentData = {
        bookingId: this.bookingId,
        paymentMethod,
        amount: this.bookingData.totalPrice,
      };

      const response = await PaymentService.processPayment(paymentData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Payment successful!");

        setTimeout(() => {
          window.location.href = `/user/my-bookings.html?bookingId=${this.bookingId}`;
        }, 2000);
      } else {
        Notifications.error(response.error || "Payment failed");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error processing payment");
      console.error("Payment error:", error);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    BookingConfirmPage.init(),
  );
} else {
  BookingConfirmPage.init();
}

export default BookingConfirmPage;
