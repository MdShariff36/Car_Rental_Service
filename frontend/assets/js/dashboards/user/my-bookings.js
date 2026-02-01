// FILE: assets/js/dashboards/user/my-bookings.js

import { requireUser } from "../../../core/auth-guard.js";
import { initUserSidebar } from "../../../components/sidebar-user.js";
import { bookingService } from "../../../services/booking.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";
import { confirmModal } from "../../../components/modal.js";

export const initMyBookings = async () => {
  if (!requireUser()) return;

  initUserSidebar();
  await loadBookings();
  setupFilters();
};

let allBookings = [];

const loadBookings = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    allBookings = await bookingService.getUserBookings(user.id);
    displayBookings(allBookings);
  } catch (error) {
    console.error("Failed to load bookings:", error);
  } finally {
    hideLoader();
  }
};

const displayBookings = (bookings) => {
  const container = document.querySelector("#bookings-list");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '<p class="text-center">No bookings found.</p>';
    return;
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
    <div class="booking-card">
      <div class="booking-header">
        <div class="car-info">
          <img src="${booking.car?.image}" alt="${booking.car?.name}" onerror="this.src='/assets/images/car-placeholder.jpg'">
          <div>
            <h4>${booking.car?.name}</h4>
            <p>${booking.car?.type} • ${booking.car?.transmission}</p>
          </div>
        </div>
        <span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span>
      </div>
      <div class="booking-details">
        <div class="detail-item">
          <span class="label">Booking ID:</span>
          <span class="value">${booking.id}</span>
        </div>
        <div class="detail-item">
          <span class="label">Pickup Date:</span>
          <span class="value">${formatDate(booking.startDate)}</span>
        </div>
        <div class="detail-item">
          <span class="label">Return Date:</span>
          <span class="value">${formatDate(booking.endDate)}</span>
        </div>
        <div class="detail-item">
          <span class="label">Total Days:</span>
          <span class="value">${booking.totalDays} days</span>
        </div>
        <div class="detail-item">
          <span class="label">Total Amount:</span>
          <span class="value">${formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>
      <div class="booking-actions">
        ${
          booking.status === "pending" || booking.status === "confirmed"
            ? `
          <button class="btn btn-danger btn-sm" data-cancel-booking="${booking.id}">Cancel Booking</button>
        `
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("");

  setupBookingActions();
};

const setupBookingActions = () => {
  document.querySelectorAll("[data-cancel-booking]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const bookingId = btn.getAttribute("data-cancel-booking");

      const confirmed = await confirmModal(
        "Are you sure you want to cancel this booking?",
      );
      if (!confirmed) return;

      showLoader();

      try {
        await bookingService.cancelBooking(bookingId);
        showNotification("Booking cancelled successfully", "success");
        await loadBookings();
      } catch (error) {
        showNotification("Failed to cancel booking", "error");
      } finally {
        hideLoader();
      }
    });
  });
};

const setupFilters = () => {
  const filterSelect = document.querySelector("#booking-filter");

  filterSelect?.addEventListener("change", (e) => {
    const status = e.target.value;

    if (status === "all") {
      displayBookings(allBookings);
    } else {
      const filtered = allBookings.filter((b) => b.status === status);
      displayBookings(filtered);
    }
  });
};

const getStatusColor = (status) => {
  const colors = {
    pending: "warning",
    confirmed: "info",
    ongoing: "primary",
    completed: "success",
    cancelled: "danger",
  };
  return colors[status] || "secondary";
};
