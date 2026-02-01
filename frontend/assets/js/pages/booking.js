//javascript
// FILE: assets/js/pages/booking.js

import { bookingService } from "../services/booking.service.js";
import { formatCurrency, formatDate } from "../base/helpers.js";
import { storage } from "../base/storage.js";
import { requireAuth } from "../core/auth-guard.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showNotification } from "../ui/notifications.js";

export const initBooking = () => {
  if (!requireAuth()) return;

  const bookingData = storage.get("pending_booking");

  if (!bookingData) {
    showNotification("No booking data found", "error");
    window.location.href = "/cars";
    return;
  }

  displayBookingSummary(bookingData);
  setupBookingForm(bookingData);
};

const displayBookingSummary = (bookingData) => {
  const summaryEl = document.querySelector("#booking-summary");
  if (!summaryEl) return;

  const car = bookingData.car;

  summaryEl.innerHTML = `
    <div class="car-info">
      <img src="${car.image}" alt="${car.name}" onerror="this.src='/assets/images/car-placeholder.jpg'">
      <div>
        <h4>${car.name}</h4>
        <p>${car.type} • ${car.transmission} • ${car.fuel}</p>
      </div>
    </div>
    <div class="booking-details">
      <div class="detail-row">
        <span>Pickup Date:</span>
        <strong>${formatDate(bookingData.startDate)}</strong>
      </div>
      <div class="detail-row">
        <span>Return Date:</span>
        <strong>${formatDate(bookingData.endDate)}</strong>
      </div>
      <div class="detail-row">
        <span>Total Days:</span>
        <strong>${bookingData.totalDays} days</strong>
      </div>
      <div class="detail-row">
        <span>Price per day:</span>
        <strong>${formatCurrency(bookingData.pricePerDay)}</strong>
      </div>
      <div class="detail-row total">
        <span>Total Amount:</span>
        <strong>${formatCurrency(bookingData.totalAmount)}</strong>
      </div>
    </div>
  `;
};

const setupBookingForm = (bookingData) => {
  const form = document.querySelector("#booking-details-form");
  if (!form) return;

  const user = storage.getUser();

  const nameInput = form.querySelector("#fullName");
  const emailInput = form.querySelector("#email");
  const phoneInput = form.querySelector("#phone");

  if (nameInput) nameInput.value = user?.name || "";
  if (emailInput) emailInput.value = user?.email || "";
  if (phoneInput) phoneInput.value = user?.phone || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    showLoader();

    try {
      const booking = await bookingService.createBooking({
        carId: bookingData.carId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalDays: bookingData.totalDays,
        pricePerDay: bookingData.pricePerDay,
        totalAmount: bookingData.totalAmount,
        pickupLocation: formData.get("pickupLocation"),
        dropoffLocation: formData.get("dropoffLocation"),
        additionalNotes: formData.get("notes"),
      });

      storage.remove("pending_booking");
      storage.set("pending_payment", {
        bookingId: booking.id,
        amount: bookingData.totalAmount,
      });

      showNotification("Booking created successfully!", "success");
      window.location.href = "/booking-confirm";
    } catch (error) {
      showNotification("Failed to create booking", "error");
    } finally {
      hideLoader();
    }
  });
};
